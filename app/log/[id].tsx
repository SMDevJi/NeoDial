import {
    View,
    Text,
    Pressable,
    Image,
    ScrollView
} from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { images } from '@/constants/images'

const LogDetails = () => {

    const router = useRouter()

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


                <View className="bg-background-card rounded-xl p-6 shadow-card  items-center">

                    <View className='justify-center'>
                        <View className="bg-green-200 items-center justify-center self-start rounded-full size-24">
                            <Text className="text-text-primary text-4xl font-bold">
                                A
                            </Text>
                        </View>
                    </View>


                    <Text className="text-3xl font-bold text-text-primary">
                        John Doe
                    </Text>

                    <Text className="text-text-secondary mt-1 text-lg">
                        +91 9876543210
                    </Text>

                </View>


                <View className="bg-background-card rounded-xl p-5 shadow-card border border-border mt-5">


                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-text-secondary">
                            Call Type
                        </Text>

                        <Text className="text-text-primary font-semibold">
                            Incoming
                        </Text>
                    </View>


                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-text-secondary">
                            Date
                        </Text>

                        <Text className="text-text-primary font-semibold">
                            12 May 2026
                        </Text>
                    </View>


                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-text-secondary">
                            Time
                        </Text>

                        <Text className="text-text-primary font-semibold">
                            10:32 AM
                        </Text>
                    </View>


                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-text-secondary">
                            Duration
                        </Text>

                        <Text className="text-text-primary font-semibold">
                            02:45
                        </Text>
                    </View>


                    <View className="flex-row justify-between items-center">
                        <Text className="text-text-secondary">
                            SIM
                        </Text>

                        <Text className="text-text-primary font-semibold">
                            SIM 1
                        </Text>
                    </View>

                </View>




                <View className="mt-6 gap-4">


                    <Pressable
                        onPress={() => router.push('/edit/abc')}
                        className="flex-row gap-2 bg-background-soft border-border border rounded-xl py-4 items-center justify-center"
                    >
                        <Image source={images.edit} className='size-5' tintColor="#2e7d32" />
                        <Text className="text-primary-dark font-bold text-base">
                            Edit Call Log
                        </Text>
                    </Pressable>


                    <Pressable className="flex-row gap-2 bg-red-50 border border-red-200 rounded-xl py-4 items-center justify-center">
                        <Image source={images.remove} className='size-6' tintColor="#ef5350" />
                        <Text className="text-missed font-bold text-base">
                            Delete Log
                        </Text>
                    </Pressable>

                </View>

            </ScrollView>

        </View>
    )
}

export default LogDetails