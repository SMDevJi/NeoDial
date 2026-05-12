import { Image, Pressable, Text, View } from 'react-native';
import React from 'react';
import { images } from '@/constants/images';

const BackUpCard = ({ backup, isDropdownOpen, onToggleDropdown, onCloseDropdown }) => {
    const options = ['Restore', 'Delete', 'Share'];

    return (
        <View style={{ position: 'relative', marginVertical: 5, zIndex: isDropdownOpen ? 2 : 1 }}>
            <View className='flex-row justify-between items-center px-5 py-6 bg-white rounded-xl'>
                <Image source={images.file2} className='size-8' tintColor="#43A047" />
                <View>
                    <Text className='font-bold'>{backup.name}</Text>
                    <View className='flex-row justify-between'>
                        <Text className='text-text-secondary font-semibold'>{backup.date}</Text>
                        <Text className='text-text-secondary font-semibold'>{backup.size}</Text>
                    </View>
                </View>
                <Pressable onPress={(e) => { e.stopPropagation(); onToggleDropdown(); }}>
                    <Image source={images.options} className="size-6" tintColor="#43A047" />
                </Pressable>
            </View>

            {isDropdownOpen && (
                <Pressable
                    onPress={() => { }}
                    style={{
                        position: 'absolute',
                        top: 70,
                        right: 20,
                        backgroundColor: 'white',
                        shadowColor: '#000',
                        shadowOpacity: 0.2,
                        shadowRadius: 5,
                        zIndex: 3,
                    }}
                    className='border border-border rounded-md'
                >
                    {options.map((option, index) => (
                        <Pressable key={index} onPress={() => { console.log(option); onCloseDropdown(); }} className='w-[30vw] py-3 px-5'>
                            <Text>{option}</Text>
                        </Pressable>
                    ))}
                </Pressable>
            )}
        </View>
    );
};

export default BackUpCard;