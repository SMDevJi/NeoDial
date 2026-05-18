import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { images } from '@/constants/images'
import { useRouter } from 'expo-router'
import formatDuration from '../lib/utils'
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// dayjs.extend(customParseFormat);

interface Props {
    isPreview?: boolean
    log: any
}

const CallRecordCard = ({ isPreview, log }: Props) => {
    const router = useRouter()





    const iconSource =
        log.type === 'INCOMING'
            ? images.incoming
            : log.type === 'OUTGOING'
                ? images.outgoing
                : log.type === 'REJECTED'
                    ? images.rejected :
                    images.missed;



    const iconColor =
        log.type === 'INCOMING'
            ? '#43A047'
            : log.type === 'OUTGOING'
                ? '#1E88E5'
                : log.type === 'REJECTED'
                    ? '#E53935' : '#E53935';



    // const date = dayjs(
    //     log.dateTime,
    //     "DD-MMM-YYYY hh:mm:ss a"
    // );



    return (
        <Pressable
            onPress={() => {
                if (!isPreview) {
                    router.push({
                        pathname: "/log/[id]",
                        params: {
                            id: String(log.id),
                            log: JSON.stringify(log),
                        },
                    });
                }

            }}
        >
            {({ pressed }) => (
                <View
                    className='flex-row items-center gap-4 py-6 px-2 border-t border-gray-200'
                    style={{
                        backgroundColor: pressed ? '#edf5ec' : isPreview ? '#edf5ec' : '#fff',
                    }}
                >
                    <Image source={iconSource} className='size-10' tintColor={iconColor} />

                    <View className="bg-green-200 items-center justify-center self-start rounded-full size-12">
                        <Text className="text-text-primary text-xl font-bold">
                            {log?.name && log?.name[0].toUpperCase()}
                            {!log?.name && log.phoneNumber[0]}
                        </Text>
                    </View>

                    <View className='flex-row justify-between flex-1'>
                        <View>
                            {!log.name &&
                                <Text className='font-bold '>{log.phoneNumber}</Text>
                            }

                            {log.name &&
                                <>
                                    <Text className='font-bold'>{log.name}</Text>
                                    <Text>{log.phoneNumber}</Text>
                                </>

                            }
                        </View>

                        <View>
                            <Text>{new Date(Number(log.timestamp)).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            })}</Text>

                            {(log?.duration != null && log?.duration != 0) && (
                                <Text>{String(formatDuration(log.duration))}</Text>
                            )}
                        </View>
                    </View>
                </View>
            )}
        </Pressable>
    )
}

export default CallRecordCard

