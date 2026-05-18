
import { NativeModules, PermissionsAndroid, Platform } from 'react-native';
import CallLogs from 'react-native-call-log';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as Contacts from 'expo-contacts';
const { StorageAccessFramework } = FileSystem;


const { CallLogModule } = NativeModules;





export async function requestAllPermissions() {

    if (Platform.OS !== 'android') {
        return false;
    }

    try {

        // normal Android permissions
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
            PermissionsAndroid.PERMISSIONS.WRITE_CALL_LOG,
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        ]);

        const permissionsGranted =
            granted['android.permission.READ_CALL_LOG'] === 'granted' &&
            granted['android.permission.WRITE_CALL_LOG'] === 'granted' &&
            granted['android.permission.READ_CONTACTS'] === 'granted' &&
            granted['android.permission.WRITE_CONTACTS'] === 'granted';

        if (!permissionsGranted) {
            return false;
        }



        return true;

    } catch (error) {

        console.error(
            'Permission request failed:',
            error
        );

        return false;
    }
}







function normalizeNumber(num) {

    if (!num) return '';

    // Convert to string
    let cleaned = String(num);

    // Remove extension part
    cleaned = cleaned.split(';')[0];

    // Keep only digits
    cleaned = cleaned.replace(/\D/g, '');

    // Use last 10 digits for matching
    // works globally in most cases
    if (cleaned.length > 10) {
        cleaned = cleaned.slice(-10);
    }

    return cleaned;
}

export async function readCallLogs() {
    const permission = await requestAllPermissions();
    if (!permission) return [];
    console.log('Loading contacts and logs!')

    // 1. load contacts once
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
        const logs = await CallLogs.loadAll();
        return logs.map(l => ({ ...l, name: '' }));
    }

    const { data: contacts } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
    });

    // 2. build phone -> name map
    const contactMap = new Map();

    for (const contact of contacts) {
        const name = contact.name || '';
        const phones = contact.phoneNumbers || [];

        for (const p of phones) {
            const raw = p.number || '';
            const normalized = normalizeNumber(raw);
            if (normalized) {
                contactMap.set(normalized, name);
            }
        }
    }

    // 3. load call logs
    const logs = await CallLogs.loadAll();

    // 4. attach contact names
    const enriched = logs.map(log => {
        const normalized = normalizeNumber(log.phoneNumber || log.number);
        const contactName = contactMap.get(normalized) || '';

        return {
            ...log,
            name: contactName,
        };
    });

    console.log("Call logs loaded!")
    //console.log(enriched)
    console.log(JSON.stringify(enriched[150],null,2))
    return enriched;
}


const typeMap = {
    INCOMING: 1,
    OUTGOING: 2,
    MISSED: 3,
    REJECTED: 5,
};

export async function editCallLogFull({
    id,
    number,
    type,
    duration,
    timestamp,
    name,
    simId
}) {
    try {
        const typeStr = (type || 'OUTGOING').toUpperCase();

        const rowsUpdated = await CallLogModule.updateCallLog(
            id.toString(),          // string
            number || '',           // string
            typeStr,                // string
            duration || '0',        // string
            Number(timestamp),      // double/number
            name || '',             // string
            simId || ''             // string
        );

        return rowsUpdated;
    } catch (e) {
        console.error('editCallLogFull error:', e);
        return 0;
    }
}









export async function addCallLog({
    number,
    type = 'OUTGOING',
    duration = '0',
    timestamp = Date.now(),
    name = null,
    simId = null,
}) {
    try {


        if (name) {
            await CallLogModule.createContactIfNotExists(name, number);
        }


        const id = await CallLogModule.addCallLog(
            number,
            type.toUpperCase(),
            duration,
            timestamp,
            name || '',
            simId || ''
        );

        return id;

    } catch (e) {
        console.error('addCallLog error:', e);
        return null;
    }
}



export async function deleteCallLog(id) {
    try {
        const rowsDeleted = await CallLogModule.deleteCallLog(id.toString());
        return rowsDeleted;
    } catch (e) {
        console.error('deleteCallLog error:', e);
        return 0;
    }
}












export async function backupCallLogs() {
    try {
        const logs = await readCallLogs();
        const json = JSON.stringify(logs, null, 2);

        // Ask user to pick a folder
        const permissions =
            await StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (!permissions.granted) {
            console.log('Folder permission denied');
            return null;
        }

        const fileName = `call_logs_backup_${Date.now()}.json`;

        // Create file inside selected folder
        const fileUri = await StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName,
            'application/json'
        );

        // Write content
        await FileSystem.writeAsStringAsync(fileUri, json, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        console.log('Backup saved:', fileUri);

        return fileUri;

    } catch (e) {
        console.error('backupCallLogs error:', e);
        return null;
    }
}




export async function restoreCallLogsFromFile(setDone:any,setTotal:any) {
    try {
        // 1. Pick backup file
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/json',
            copyToCacheDirectory: true,
        });

        if (result.canceled) {
            console.log('User cancelled file picker');
            return false;
        }

        const fileUri = result.assets[0].uri;

        // 2. Read file content
        const jsonData = await FileSystem.readAsStringAsync(fileUri);

        // 3. Parse JSON
        const logs = JSON.parse(jsonData);

        setTotal(logs.length)

        if (!Array.isArray(logs)) {
            throw new Error('Invalid backup format');
        }

        // 4. Restore logs
        for (const log of logs) {
            //console.log(log)
            await addCallLog({
                number: log.phoneNumber || log.number || '',
                type: (log.type || 'OUTGOING').toUpperCase(),
                duration: String(log.duration ?? '0'),
                timestamp: Number(log.timestamp ?? Date.now()),
                name: log.name || null,
                simId: log.simId || null,
            });
            setDone(prev=>prev+1)
        }

        return true;
    } catch (e) {
        console.error('restoreCallLogs error:', e);
        return false;
    }
}