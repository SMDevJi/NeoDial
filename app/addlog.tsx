import {
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native'
import React, { useState } from 'react'
import { images } from '@/constants/images'
import { useRouter } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker'
import CallRecordCard from '@/components/CallRecordCard'
import { addCallLog, editCallLogFull,deleteCallLog } from '../lib/CallLogUtil';

const addlog = () => {

    const router = useRouter()



    const [contactName, setContactName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [callType, setCallType] = useState('Incoming')

    const [selectedDate, setSelectedDate] = useState(new Date())

    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)

    const [duration, setDuration] = useState('')
    const [selectedSim, setSelectedSim] = useState('SIM 1')


    const formattedDate = selectedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })


    const formattedTime = selectedDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })


    const formatDuration = (seconds: string) => {

        const totalSeconds = Number(seconds)

        if (!totalSeconds) return '0 sec'

        const hrs = Math.floor(totalSeconds / 3600)
        const mins = Math.floor((totalSeconds % 3600) / 60)
        const secs = totalSeconds % 60

        if (hrs > 0) {
            return `${hrs} hr ${mins} min`
        }

        if (mins > 0) {
            return `${mins} min ${secs} sec`
        }

        return `${secs} sec`
    }

    const handleSave = async () => {
        const newCallId = await addCallLog({
            number: '1234567890',
            type: 'REJECTED',
            duration: '60',          // seconds
            timestamp: Date.now(),
            name: 'hihi',
            simId: 'SIM 1'
        });

         console.log('Added call log with ID:', newCallId);


        // const rowsUpdated = await editCallLogFull({
        //     id: '2',                 // Call log ID to edit
        //     number: '5551234567',    // New number
        //     type: 'REJECTED',        // Change type to REJECTED
        //     duration: '60',          // Duration in seconds
        //     timestamp: Date.now(),   // Current timestamp
        //     name: 'Test Edited',     // Optional: new name
        //     simId: 'SIM_1',          // Optional: SIM/phone account
        // });

        // console.log('Rows updated:', rowsUpdated);
        // alert(`Rows updated: ${rowsUpdated}`);



    //      const result = await deleteCallLog('2');
    // console.log('Rows deleted:', result);

        router.push('/')
    }

    return (

        <View className="flex-1 bg-white">


            <View className="relative justify-center items-center h-14">

                <Pressable className="absolute left-5" onPress={() => router.back()}>
                    <Image source={images.leftArrow} className="size-6" />
                </Pressable>

                <Text className="text-xl font-bold">
                    Add Call Log
                </Text>

                <Pressable
                    onPress={handleSave}
                    className="absolute right-5"
                >
                    <Text className="text-primary-dark font-bold text-lg">
                        Save
                    </Text>
                </Pressable>

            </View>



            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 120,
                }}
            >


                <View className="mb-5">

                    <Text className="text-text-primary font-bold mb-2 ">
                        Contact Name
                    </Text>

                    <TextInput
                        value={contactName}
                        onChangeText={setContactName}
                        placeholder="Enter contact name"
                        placeholderTextColor="#757575"
                        className="bg-background-card border border-border rounded-xl p-4 text-text-primary font-semibold"
                    />

                </View>


                <View className="mb-5">

                    <Text className="text-text-primary mb-2 font-bold">
                        Phone Number
                    </Text>

                    <TextInput
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        placeholder="+91 9876543210"
                        placeholderTextColor="#757575"
                        className="bg-background-card border border-border rounded-xl p-4 text-text-primary font-semibold"
                    />

                </View>


                <View className="mb-5">

                    <Text className="text-text-primary mb-3 font-bold">
                        Call Type
                    </Text>

                    <View className="flex-row gap-2">

                        {['Incoming', 'Outgoing', 'Missed'].map((type) => {

                            const isSelected = callType === type

                            const iconSource =
                                type === 'Incoming'
                                    ? images.incoming
                                    : type === 'Outgoing'
                                        ? images.outgoing
                                        : images.missed;

                            const iconColor =
                                type === 'Incoming'
                                    ? '#43A047'
                                    : type === 'Outgoing'
                                        ? '#1E88E5'
                                        : '#E53935';

                            return (
                                <Pressable
                                    key={type}
                                    onPress={() => setCallType(type)}
                                    className={`flex-1 flex-row gap-2 rounded-xl py-4 px-2 items-center border ${isSelected
                                        ? 'bg-background-soft border-primary'
                                        : 'bg-white border-border'
                                        }`}
                                >
                                    <Image source={iconSource} className="size-6" tintColor={iconColor} />
                                    <Text
                                        className={`font-semibold ${isSelected
                                            ? 'text-primary-dark'
                                            : 'text-text-secondary'
                                            }`}
                                    >
                                        {type}
                                    </Text>
                                </Pressable>
                            )
                        })}

                    </View>

                </View>


                <View className="mb-5">

                    <Text className="text-text-primary mb-2 font-bold">
                        Date
                    </Text>

                    <Pressable
                        onPress={() => setShowDatePicker(true)}
                        className="bg-background-card border border-border rounded-xl p-4 flex-row justify-between items-center"
                    >

                        <Text className="text-text-primary font-semibold">
                            {formattedDate}
                        </Text>

                        <Text className="text-text-primary font-semibold">
                            Select
                        </Text>

                    </Pressable>

                </View>


                <View className="mb-5">

                    <Text className="text-text-primary mb-2 font-bold">
                        Time
                    </Text>

                    <Pressable
                        onPress={() => setShowTimePicker(true)}
                        className="bg-background-card border border-border rounded-xl p-4 flex-row justify-between items-center"
                    >

                        <Text className="text-text-primary font-semibold">
                            {formattedTime}
                        </Text>

                        <Text className="text-text-primary font-semibold">
                            Select
                        </Text>

                    </Pressable>

                </View>


                <View className="mb-5">

                    <Text className="text-text-primary mb-2 font-bold">
                        Duration (seconds)
                    </Text>

                    <View className="flex-row items-center gap-3">

                        <TextInput
                            value={duration}
                            onChangeText={setDuration}
                            keyboardType="numeric"
                            placeholder="45"
                            placeholderTextColor="#757575"
                            className="flex-1 bg-background-card border border-border rounded-xl p-4 text-text-primary font-semibold"
                        />

                        <View className="bg-primary/10 p-4 rounded-xl">

                            <Text className="text-primary-dark font-semibold">
                                {formatDuration(duration)}
                            </Text>

                        </View>

                    </View>

                </View>


                <View className="mb-5">

                    <Text className="text-text-primary mb-3 font-bold">
                        SIM
                    </Text>

                    <View className="flex-row gap-2">

                        {['SIM 1', 'SIM 2'].map((sim) => {

                            const isSelected = selectedSim === sim

                            return (
                                <Pressable
                                    key={sim}
                                    onPress={() => setSelectedSim(sim)}
                                    className={`flex-1 rounded-xl py-4 items-center border ${isSelected
                                        ? 'bg-background-soft border-primary'
                                        : 'bg-white border-border'
                                        }`}
                                >
                                    <Text
                                        className={`font-semibold ${isSelected
                                            ? 'text-primary-dark'
                                            : 'text-text-secondary'
                                            }`}
                                    >
                                        {sim}
                                    </Text>
                                </Pressable>
                            )
                        })}

                    </View>

                </View>


                <View className="bg-background-soft border border-primary rounded-xl p-5">

                    <Text className="text-primary-dark font-bold text-lg mb-4">
                        Preview
                    </Text>

                    <CallRecordCard isPreview={true} />

                    {/* <View className="flex-row justify-between items-center">

                        <View>

                            <Text className="text-text-primary font-semibold text-lg">
                                {contactName || 'John Doe'}
                            </Text>

                            <Text className="text-text-secondary mt-1">
                                {phoneNumber || '+91 9876543210'}
                            </Text>

                            <Text className="text-text-secondary mt-1">
                                {formatDuration(duration)}
                            </Text>

                        </View>

                        <View className="items-end">

                            <Text className="text-text-secondary text-sm">
                                {formattedTime}
                            </Text>

                            <Text className="text-text-secondary text-sm mt-1">
                                {formattedDate}
                            </Text>

                            <Text className="text-incoming font-semibold mt-2">
                                {callType}
                            </Text>

                        </View>

                    </View> */}
                </View>

            </ScrollView>


            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {

                        setShowDatePicker(false)

                        if (date) {
                            setSelectedDate(date)
                        }
                    }}
                />
            )}


            {showTimePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="time"
                    display="default"
                    onChange={(event, date) => {

                        setShowTimePicker(false)

                        if (date) {
                            setSelectedDate(date)
                        }
                    }}
                />
            )}

        </View>
    )
}

export default addlog