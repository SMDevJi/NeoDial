import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { images } from '@/constants/images'
import { Link } from "expo-router";
import CallRecordCard from "@/components/CallRecordCard";
import { useEffect } from "react";
import { requestAllPermissions } from "@/lib/CallLogUtil";

export default function Index() {


  useEffect(() => {
    requestAllPermissions();
  }, []);

  return (

    <View
      className="p-5  w-full bg-white"
    >
      <View className="flex-row justify-between items-center mt-5">
        <Text className="text-3xl font-semibold">Call Logs</Text>
        <View className="flex-row gap-5">
          <Image source={images.search}
            className='size-8' />
          <Image source={images.filter}
            className='size-8' />
        </View>
      </View>


      <View className="flex-row w-full justify-between items-center mt-7 h-16 rounded-md overflow-hidden">
        <View className="flex-row justify-center items-center w-1/2 h-full gap-1 bg-background-soft border-b-2 border-b-primary-dark">
          <Image source={images.manage} className="size-6" tintColor="#2E7D32" />
          <Text className="text-lg font-semibold text-primary-dark">Manage</Text>
        </View>

        <Link href='/backupRestore' className="w-1/2">
          <View className="flex-row justify-center items-center w-full h-full flex-1 gap-2 bg-background">
            <Image source={images.backup} className="size-6" tintColor="#757575" />
            <Text className="text-lg font-semibold text-text-secondary">Backup / Restore</Text>
          </View>
        </Link>

      </View>


      <ScrollView className="mt-5" >
        <Text className="font-bold mb-4">Today</Text>
        <CallRecordCard />
        <CallRecordCard />
        <CallRecordCard />

        <Text className="font-bold mb-4">Yesterday</Text>
        <CallRecordCard />
        <CallRecordCard />
        <CallRecordCard />
      </ScrollView>


      <Link href="/addlog" asChild>
        <Pressable className="absolute bottom-12 right-14 bg-primary-dark w-16 h-16 rounded-full items-center justify-center">
          <Text className="text-4xl text-white font-light">+</Text>
        </Pressable>
      </Link>

    </View>
  );
}
