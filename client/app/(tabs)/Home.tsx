import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
    Platform,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

const TAB_BAR_HEIGHT = 60;

const Home = () => {
    return (
        <SafeAreaView className="flex-1 bg-blue-50">
            <ScrollView
                contentContainerStyle={{
                    paddingBottom:
                        Platform.OS === "ios"
                            ? TAB_BAR_HEIGHT
                            : TAB_BAR_HEIGHT + 20,
                }}
            >

                {/* Header */}
                <View className="bg-blue-600 p-10 rounded-b-3xl shadow-lg">
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-white text-3xl font-extrabold">
                                DocBooker
                            </Text>
                            <Text className="text-blue-100 text-sm mt-1">
                                Your Health, Our Priority
                            </Text>
                        </View>
                        <TouchableOpacity className="bg-blue-500 p-2 rounded-full">
                            <Ionicons
                                name="notifications"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                </View>


                {/* Search Bar */}
                <View className="bg-white mx-4 -mt-6 rounded-full flex-row items-center p-4 shadow-lg">
                    <Ionicons name="search" size={24} color="#3B82F6" />
                    <TextInput
                        className="flex-1 ml-3 text-gray-700 text-base"
                        placeholder="Search doctors, specialties, symptoms..."
                    />
                    <TouchableOpacity className="bg-blue-500 p-2 rounded-full">
                        <Ionicons name="options" size={20} color="white" />
                    </TouchableOpacity>
                </View>


                {/* Quick Actions */}
                <View className="flex-row justify-around mx-4 my-6">
                    {[
                        { icon: "user-md", title: "Find Doctors" },
                        { icon: "calendar-check", title: "Appointments" },
                        { icon: "comments", title: "Consult Now" },
                        { icon: "file-medical-alt", title: "Health Records" },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} className="items-center">
                            <View className="bg-blue-100 p-4 rounded-2xl shadow-md">
                                <FontAwesome5
                                    name={item.icon}
                                    size={24}
                                    color="#3B82F6"
                                />
                            </View>
                            <Text className="mt-2 text-blue-700 font-medium text-xs">
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>


                {/* Featured Doctor */}
                <View className="mx-4 my-6 bg-white rounded-2xl shadow-lg p-4">
                    <Text className="text-xl font-bold text-blue-800 mb-3">
                        Featured Doctor
                    </Text>
                    <View className="flex-row items-center">
                        <Image
                            source={{
                                uri: "https://randomuser.me/api/portraits/men/36.jpg",
                            }}
                            className="w-20 h-20 rounded-full"
                        />
                        <View className="ml-4 flex-1">
                            <Text className="font-bold text-blue-700 text-lg">
                                Dr. John Smith
                            </Text>
                            <Text className="text-blue-600">
                                Cardiologist, 15 years exp.
                            </Text>
                            <View className="flex-row items-center mt-1">
                                <Ionicons
                                    name="star"
                                    size={16}
                                    color="#FBC02D"
                                />
                                <Text className="text-gray-600 ml-1">
                                    4.9 (120 reviews)
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity className="bg-blue-500 py-2 px-4 rounded-full">
                            <Text className="text-white font-bold">Book</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {/* Nearby Doctors */}
                <View className="mx-4 my-6">
                    <Text className="text-xl font-bold text-blue-800 mb-4">
                        Nearby Doctors
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {[1, 2, 3].map((item) => (
                            <TouchableOpacity
                                key={item}
                                className="bg-white p-4 rounded-2xl shadow-md mr-4 w-64"
                            >
                                <View className="flex-row items-center mb-3">
                                    <Image
                                        source={{
                                            uri: `https://randomuser.me/api/portraits/women/${
                                                30 + item
                                            }.jpg`,
                                        }}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <View className="ml-3">
                                        <Text className="font-bold text-blue-700">
                                            Dr. Sarah Johnson
                                        </Text>
                                        <Text className="text-blue-600 text-sm">
                                            Pediatrician
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <Ionicons
                                            name="location"
                                            size={16}
                                            color="#3B82F6"
                                        />
                                        <Text className="text-gray-600 ml-1">
                                            0.8 miles
                                        </Text>
                                    </View>
                                    <TouchableOpacity className="bg-blue-100 py-1 px-3 rounded-full">
                                        <Text className="text-blue-700 font-semibold">
                                            Details
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>


                {/* Popular Specialties */}
                <View className="mx-4 my-6">
                    <Text className="text-xl font-bold text-blue-800 mb-4">
                        Popular Specialties
                    </Text>
                    <View className="flex-row flex-wrap justify-between">
                        {[
                            "Dentist",
                            "Pediatrician",
                            "Dermatologist",
                            "Orthopedic",
                        ].map((specialty, index) => (
                            <TouchableOpacity
                                key={specialty}
                                className="bg-white p-4 rounded-2xl shadow-md mb-4 w-[48%] items-center"
                            >
                                <View className="bg-blue-100 p-3 rounded-full mb-2">
                                    <FontAwesome5
                                        name={
                                            [
                                                "tooth",
                                                "baby",
                                                "allergies",
                                                "bone",
                                            ][index]
                                        }
                                        size={24}
                                        color="#3B82F6"
                                    />
                                </View>
                                <Text className="text-blue-700 font-semibold text-center">
                                    {specialty}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;
