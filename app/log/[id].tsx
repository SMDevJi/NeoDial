import {
    View,
    Text,
    Pressable,
    Image,
    ScrollView,
    ToastAndroid,
    Alert,
    ActivityIndicator
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { images } from '@/constants/images'
import { deleteCallLog, readCallLogs, requestAllPermissions } from '@/lib/CallLogUtil'
import formatDuration from '@/lib/utils'

const LogDetails = () => {
    const [logData, setLogData] = useState(null)
    const params = useLocalSearchParams();

    const log = JSON.parse(params.log as string);
    const logId = params.id;

    console.log(log, logId)

    const router = useRouter()






    const deleteLog = async () => {
        try {
            Alert.alert(
                'Delete log?',
                'Are you sure you want to delete this log?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Yes',
                        onPress: async () => {
                            console.log('Confirmed')
                            await deleteCallLog(logId)
                            ToastAndroid.show('Call log deleted successfully!', ToastAndroid.SHORT);
                            router.push('/')
                        },
                    },
                ],
                { cancelable: true },
            );


        } catch (error) {
            ToastAndroid.show('Failed to delete call log!', ToastAndroid.SHORT);
        }

    }



    useEffect(() => {
        setLogData(log)
    }, []);


    if (!logData) {
        return <View className='flex-col justify-center items-center h-full '>
            <Text className="text-xl font-bold text-text-secondary ">
                Loading..
            </Text>
            <ActivityIndicator size="large" color="#66BB6A" className="" />
        </View>
    }

    return (
        <View className="flex-1 bg-white">


            <View className="relative justify-center items-start h-14 ">

                <Pressable
                    onPress={() => router.back()}
                    className="left-5"
                >
                    <Image
                        source={images.leftArrow}
                        className="size-6"
                    />
                </Pressable>

            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    padding: 20,
                    paddingBottom: 120
                }}
            >


                <View className="bg-background-card rounded-xl p-6 shadow-card gap-2 items-center">

                    <View className='justify-center'>
                        <View className="bg-green-200 items-center justify-center self-start rounded-full size-24">
                            {logData && <Text className="text-text-primary text-4xl font-bold">
                                {logData?.name && logData?.name[0]?.toUpperCase()}
                                {!logData?.name && logData?.phoneNumber[0]}
                            </Text>}
                        </View>
                    </View>


                    {logData?.name && <Text className="text-3xl font-bold text-text-primary">
                        {logData?.name}
                    </Text>}

                    <Text className="text-text-secondary mt-1 text-lg">
                        {logData?.phoneNumber}
                    </Text>

                </View>


                <View className="bg-background-card rounded-xl p-5 shadow-card border border-border mt-5">


                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-text-secondary">
                            Call Type
                        </Text>

                        <Text className="text-text-primary font-semibold">
                            {logData?.type}
                        </Text>
                    </View>


                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-text-secondary">
                            Date
                        </Text>

                        <Text className="text-text-primary font-semibold">
                            {new Date(Number(logData?.timestamp)).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </Text>
                    </View>


                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-text-secondary">
                            Time
                        </Text>

                        <Text className="text-text-primary font-semibold">
                            {new Date(Number(logData?.timestamp)).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </Text>
                    </View>


                    {logData?.duration != 0 &&
                        <View className="flex-row justify-between items-center mb-5">
                            <Text className="text-text-secondary">
                                Duration
                            </Text>

                            <Text className="text-text-primary font-semibold">
                                {formatDuration(logData?.duration)}
                            </Text>
                        </View>
                    }


                    {/* <View className="flex-row justify-between items-center">
                        <Text className="text-text-secondary">
                            SIM
                        </Text>

                        <Text className="text-text-primary font-semibold">
                            SIM 1
                        </Text>
                    </View> */}

                </View>




                <View className="mt-6 gap-4">


                    <Pressable
                        onPress={() =>
                            router.push({
                                pathname: "/edit/[id]",
                                params: {
                                    id: String(log.id),
                                    log: JSON.stringify(log),
                                },
                            })
                        }
                    className="flex-row gap-2 bg-background-soft border-border border rounded-xl py-4 items-center justify-center"
                    >
                    <Image source={images.edit} className='size-5' tintColor="#2e7d32" />
                    <Text className="text-primary-dark font-bold text-base">
                        Edit Call Log
                    </Text>
                </Pressable>


                <Pressable
                    onPress={() => deleteLog()}
                    className="flex-row gap-2 bg-red-50 border border-red-200 rounded-xl py-4 items-center justify-center">
                    <Image source={images.remove} className='size-6' tintColor="#ef5350" />
                    <Text className="text-missed font-bold text-base">
                        Delete Log
                    </Text>
                </Pressable>

        </View>

            </ScrollView >

        </View >
    )
}

export default LogDetails