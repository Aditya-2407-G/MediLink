import React, { useCallback } from "react";
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
import axios from "axios";
import { debounce } from "lodash";
import { router} from "expo-router";

const TAB_BAR_HEIGHT = 64;

const Home = () => {
    // // const API_URL = "http://192.168.0.174:8000";
    // const API_URL = "http://192.168.29.57:8000";
    const searchDoctors = useCallback(
        debounce(async (query) => {
            console.log(`${process.env.EXPO_PUBLIC_API_URL}/doctor/search?query=${query}`);
            try {
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_API_URL}/doctor/search?searchTerm=${query}`
                );
                console.log(response.data);
            } catch (error) {
                console.error("Error searching for doctors:", error);
            }
        }, 300),
        []
    );

    const handleSearchChange = (text) => {
        searchDoctors(text);
    };

    return (
        <SafeAreaView className="flex-1 bg-blue-50">
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                    paddingBottom: TAB_BAR_HEIGHT,
                    paddingTop:20
                }}
            >
                {/* Header */}
                <View className="bg-blue-600 p-10 rounded-b-3xl shadow-lg">
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-white text-3xl font-poppins-light">
                                MediLink
                            </Text>
                            <Text className="text-blue-100 text-sm mt-1 font-poppins-light">
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
                        onChangeText={handleSearchChange}
                        className="flex-1 ml-3 text-gray-700 text-base font-poppins-regular"
                        placeholder="Search doctors, specialties..."
                    />
                    <TouchableOpacity className="bg-blue-500 p-2 rounded-full">
                        <Ionicons name="options" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <View className="flex-row justify-around mx-4 my-6">
                    {[
                        {
                            icon: "user-md",
                            title: "Find Doctors",
                            screen: "FindDoctor",
                        },
                        { icon: "calendar-check", title: "Appointments" },
                        { icon: "comments", title: "Consult Now" },
                        { icon: "file-medical-alt", title: "Health Records" },
                    ].map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className="items-center"
                            onPress={() =>
                                item.screen
                                // @ts-ignore
                                ? router.push(item.screen)
                                    : null
                            }
                        >
                            <View className="bg-blue-100 p-4 rounded-2xl shadow-md">
                                <FontAwesome5
                                    name={item.icon}
                                    size={24}
                                    color="#3B82F6"
                                />
                            </View>
                            <Text className="mt-2 text-blue-700 font-poppins-medium text-xs">
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Nearby Doctors */}
                <View className="mx-4 my-6">
                    <Text className="text-xl font-poppins-bold text-blue-800 mb-4">
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
                                        <Text className="font-poppins-bold text-blue-700">
                                            Dr. Sarah Johnson
                                        </Text>
                                        <Text className="text-blue-600 text-sm font-poppins-regular">
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
                                        <Text className="text-gray-600 ml-1 font-poppins-regular">
                                            0.8 miles
                                        </Text>
                                    </View>
                                    <TouchableOpacity className="bg-blue-100 py-1 px-3 rounded-full">
                                        <Text className="text-blue-700 font-poppins-semibold">
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
                    <Text className="text-xl font-poppins-bold text-blue-800 mb-4">
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
                                <Text className="text-blue-700 font-poppins-semibold text-center">
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
