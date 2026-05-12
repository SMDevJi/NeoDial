import { Image, Pressable, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { images } from '@/constants/images';
import { useRouter } from 'expo-router';
import BackUpCard from '@/components/BackUpCard';
import { readCallLogs } from '../lib/CallLogUtil'
const backups = [
  { id: 1, name: 'call_logs_backup_1747758431.db', date: 'May 20, 2025 10:45 AM', size: '2.4 MB' },
  { id: 2, name: 'call_logs_backup_1747758432.db', date: 'May 21, 2025 11:00 AM', size: '3.1 MB' },
  { id: 3, name: 'call_logs_backup_1747758433.db', date: 'May 22, 2025 09:15 AM', size: '1.8 MB' },
];

const BackupRestore = () => {
  const router = useRouter();
  const [openDropdownId, setOpenDropdownId] = useState(null);


  const handleCreateBackup = async () => {
    const allLogs = await readCallLogs()
    console.log(allLogs)
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
        <Pressable className='flex-row items-center gap-2 bg-background-soft px-4 py-3 rounded-xl'>
          <Image source={images.file} className="size-6" tintColor='#2e7d32' />
          <Text className='text-primary-dark font-semibold'>Restore Backup</Text>
        </Pressable>
      </View>


      <View className='p-3 flex-1'>
        <Text className='text-lg font-bold'>Backup History</Text>

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
        </ScrollView>
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