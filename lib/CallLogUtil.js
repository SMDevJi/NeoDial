import { NativeModules, PermissionsAndroid, Platform } from 'react-native';
import CallLogs from 'react-native-call-log';

const { CallLogModule } = NativeModules;


export async function requestAllPermissions() {
    if (Platform.OS !== 'android') return false;

    const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        PermissionsAndroid.PERMISSIONS.WRITE_CALL_LOG,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
    ]);

    const allGranted =
        granted['android.permission.READ_CALL_LOG'] === 'granted' &&
        granted['android.permission.WRITE_CALL_LOG'] === 'granted' &&
        granted['android.permission.READ_CONTACTS'] === 'granted' &&
        granted['android.permission.WRITE_CONTACTS'] === 'granted';

    return allGranted;
}


export async function readCallLogs() {
    const permission = await requestAllPermissions();
    if (!permission) return [];

    const logs = await CallLogs.loadAll();
    return logs;
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







/**
 * Add a call log
 * Note: You must implement addCallLog in CallLogModule.java
 * @param {string} number
 * @param {string} duration
 * @param {string} type - 'INCOMING' | 'OUTGOING' | 'MISSED'
 * @param {number} timestamp - Unix timestamp in ms
 */
const typeMap2 = {
    INCOMING: 'INCOMING',
    OUTGOING: 'OUTGOING',
    MISSED: 'MISSED',
    REJECTED: 'REJECTED',
};

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
    const logs = await readCallLogs();
    return JSON.stringify(logs, null, 2);
}


export async function restoreCallLogs(jsonData) {
    try {
        const logs = JSON.parse(jsonData);
        for (const log of logs) {
            await addCallLog({
                number: log.phoneNumber || log.number,
                duration: log.duration || '0',
                type: log.type || 'OUTGOING',
                timestamp: log.timestamp || Date.now(),
            });
        }
        return true;
    } catch (e) {
        console.error('restoreCallLogs error:', e);
        return false;
    }
}