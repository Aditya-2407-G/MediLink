import React, { useState, useEffect, } from "react";
import { View, Text, Image, ScrollView, SafeAreaView, TouchableOpacity, Linking, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import * as Location from 'expo-location';

const DoctorInfo = () => {
    const route = useRoute();
    let { doctor }: any = route.params;
    doctor=JSON.parse(doctor);
    const [location, setLocation] = useState(null);

    const GetLocation = async () => {
        try {
            // Check if location permission is granted
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status !== "granted") {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    console.log("Permission not granted");
                    return;
                }
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        } catch (error) {
            console.error("Error getting location:", error);
        }
    };

    useEffect(() => {
        GetLocation();
    }, []);

    const openMapsWithDirections = () => {
        if (location) {
            const userLat = location["coords"]["latitude"];
            const userLon = location["coords"]["longitude"];
            const doctorLat = doctor.location.coordinates[1];
            const doctorLon = doctor.location.coordinates[0];
            const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${doctorLat},${doctorLon}`;
            Linking.openURL(url);
        } else {
            console.log('User location not available');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-blue-50">
            <ScrollView className="p-4">
                <View className="items-center mb-6 mt-10">
                    <Image
                        source={require("@/assets/images/avatar6.png")}
                        className="w-32 h-32 rounded-full"
                    />
                    <Text className="font-poppins-bold text-blue-700 text-2xl mt-4">
                        {doctor.doctorName}
                    </Text>
                    <Text className="text-blue-600 font-poppins-regular text-lg">
                        {doctor.specialization}
                    </Text>
                </View>

                <View className="bg-white p-4 rounded-2xl shadow-md mb-4">
                    <Text className="font-poppins-bold text-blue-700 text-lg mb-2">
                        Experience
                    </Text>
                    <Text className="text-gray-600 font-poppins-regular">
                        {doctor.experience} Years
                    </Text>
                </View>

                <View className="bg-white p-4 rounded-2xl shadow-md mb-4">
                    <Text className="font-poppins-bold text-blue-700 text-lg mb-2">
                        Hospital
                    </Text>
                    <Text className="text-gray-600 font-poppins-regular">
                        {doctor.hospitalName},
                    </Text>
                </View>

                <View className="bg-white p-4 rounded-2xl shadow-md mb-4">
                    <Text className="font-poppins-bold text-blue-700 text-lg mb-2">
                        Location
                    </Text>
                    <View className="flex-row items-center">
                        <Ionicons name="location" size={16} color="#3B82F6" />
                        <Text className="text-gray-600 ml-1 font-poppins-regular">
                            {doctor.city}, {doctor.state}
                        </Text>
                        <Text className="text-gray-600 ml-1 font-poppins-regular">
                            {doctor.country}
                        </Text>
                    </View>
                    <TouchableOpacity 
                        onPress={openMapsWithDirections}
                        className="bg-blue-500 p-2 rounded-lg mt-2"
                    >
                        <Text className="text-white text-center font-poppins-semibold">
                            Get Directions
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="bg-white p-4 rounded-2xl shadow-md mb-4">
                    <Text className="font-poppins-bold text-blue-700 text-lg mb-2">
                        Fees
                    </Text>
                    <Text className="text-blue-700 font-poppins-semibold text-lg">
                        ₹{doctor.fees}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DoctorInfo;