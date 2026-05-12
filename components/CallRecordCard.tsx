import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { images } from '@/constants/images'
import { useRouter } from 'expo-router'

const CallRecordCard = ({isPreview}:{isPreview?:boolean}) => {
    const router = useRouter()

    return (
        <Pressable
            onPress={() => {
                if(!isPreview){
                    router.push('/log/abc')
                }
                
            }}
        >
            {({ pressed }) => (
                <View
                    className='flex-row items-center gap-4 py-6 px-2 border-t border-gray-200'
                    style={{
                        backgroundColor: pressed ? '#edf5ec' : isPreview?'#edf5ec':'#fff',
                    }}
                >
                    <Image source={images.incoming} className='size-10' tintColor="#43A047" />

                    <View className="bg-green-200 items-center justify-center self-start rounded-full size-12">
                        <Text className="text-text-primary text-xl font-bold">
                            A
                        </Text>
                    </View>

                    <View className='flex-row justify-between flex-1'>
                        <View>
                            <Text className='font-bold'>Alice Johnson</Text>
                            <Text>+91 9876543210</Text>
                        </View>

                        <View>
                            <Text>10:32 AM</Text>
                            <Text>02:16</Text>
                        </View>
                    </View>
                </View>
            )}
        </Pressable>
    )
}

export default CallRecordCard

