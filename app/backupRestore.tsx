import { ActivityIndicator, Image, Pressable, ScrollView, Text, ToastAndroid, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { images } from '@/constants/images';
import { useRouter } from 'expo-router';
import BackUpCard from '@/components/BackUpCard';
import { backupCallLogs, readCallLogs, restoreCallLogsFromFile } from '../lib/CallLogUtil'


const BackupRestore = () => {
  const router = useRouter();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [backupLoading, setBackupLoading] = useState(false)
  const [restoreLoading, setRestoreLoading] = useState(false)
  const [done, setDone] = useState(0)
  const [total, setTotal] = useState(0)

  const handleCreateBackup = async () => {
    if(restoreLoading || backupLoading) return
    try {
      setBackupLoading(true)
      const allLogs = await readCallLogs()
      console.log(JSON.stringify(allLogs, null, 2))
      const savedLoc = await backupCallLogs()
      if(!savedLoc){
        ToastAndroid.show('Operation cancelled!', ToastAndroid.SHORT);
      }else{
        ToastAndroid.show(`Backup saved to ${savedLoc}!`, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Failed to save backup!', ToastAndroid.SHORT);
    } finally {
      setBackupLoading(false)
    }

  }


  const handleRestoreBackup = async () => {
    if(restoreLoading || backupLoading) return
    try {
      setRestoreLoading(true)
      setDone(0)
      setTotal(0)
      const backedupFlag=await restoreCallLogsFromFile(setDone,setTotal)
      
      if(!backedupFlag){
        ToastAndroid.show(`Operation cancelled!`, ToastAndroid.SHORT);
      }else{
        ToastAndroid.show('Backup restored successfully!', ToastAndroid.SHORT);
      }
      
    } catch (error) {
      ToastAndroid.show('Failed to restore backup!', ToastAndroid.SHORT);
    }finally{
      setRestoreLoading(false)
    }
  }

  return (
    <View className='bg-background-soft min-h-screen p-2'>

      <View className="relative justify-center items-center h-14">
        <Pressable className="absolute left-5" onPress={() => router.back()}>
          <Image source={images.leftArrow} className="size-6" />
        </Pressable>
        <Text className="text-xl font-bold">Backup / Restore</Text>
      </View>


      <View className='flex-row justify-between items-center mt-4 py-4 px-4 bg-white rounded-xl'>
        <View className='flex-1 mr-3'>
          <Text className='font-bold text-base'>Backup</Text>
          <Text className='text-text-secondary font-semibold text-sm mt-1'>Create a backup of your call logs.</Text>
        </View>
        <Pressable
          onPress={handleCreateBackup}
          className='flex-row items-center gap-2 bg-background-soft px-4 py-3 rounded-xl'>
          <Image source={images.cloud} className="size-6" tintColor='#2e7d32' />
          <Text className='text-primary-dark font-semibold'>Create Backup</Text>
        </Pressable>
      </View>


      <View className='flex-row justify-between items-center mt-3 py-4 px-4 bg-white rounded-xl'>
        <View className='flex-1 mr-3'>
          <Text className='font-bold text-base'>Restore</Text>
          <Text className='text-text-secondary font-semibold text-sm mt-1'>Restore call logs from a backup file.</Text>
        </View>
        <Pressable
          onPress={handleRestoreBackup}
          className='flex-row items-center gap-2 bg-background-soft px-4 py-3 rounded-xl'>
          <Image source={images.file} className="size-6" tintColor='#2e7d32' />
          <Text className='text-primary-dark font-semibold'>Restore Backup</Text>
        </Pressable>
      </View>


      <View className='p-3 flex-1 items-center'>
        {/* <Text className='text-lg font-bold'>Backup History</Text>

        <ScrollView>
          {backups.map((backup) => (
            <BackUpCard
              key={backup.id}
              backup={backup}
              isDropdownOpen={openDropdownId === backup.id}
              onToggleDropdown={() =>
                setOpenDropdownId(openDropdownId === backup.id ? null : backup.id)
              }
              onCloseDropdown={() => setOpenDropdownId(null)}
            />
          ))}
        </ScrollView> */}

        {backupLoading &&
          <>
            <Text className='mt-20 font-semibold text-text-secondary'>Creating backup file....</Text>
            <ActivityIndicator
              size="large"
              color="#2E7D32"
              className='mt-2'
            />
          </>

        }

        {restoreLoading &&
          <>
            <Text className='mt-20 font-semibold text-text-secondary'>Restoring backup file.... ({done}/{total})</Text>
            <ActivityIndicator
              size="large"
              color="#2E7D32"
              className='mt-2'
            />
          </>

        }

      </View>


      {openDropdownId && (
        <Pressable
          onPress={() => setOpenDropdownId(null)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />
      )}
    </View>
  );
};

export default BackupRestore;