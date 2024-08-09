import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

export const DoctorCard = ({ doctor, onPress }) => {
    const [userLat, setUserLat] = useState();
    const [userLon, setUserLon] = useState();

    // Get user's current location
    useEffect(() => {
        const getLocation = async () => {
            try {
                // Check if location permission is granted
                const { status } =
                    await Location.getForegroundPermissionsAsync();
                if (status !== "granted") {
                    const { status } =
                        await Location.requestForegroundPermissionsAsync();
                    if (status !== "granted") {
                        console.log("Permission not granted");
                        return;
                    }
                }
                // Get the current location
                const { coords } = await Location.getCurrentPositionAsync({});
                // @ts-ignore
                setUserLat(coords.latitude);
                // @ts-ignore
                setUserLon(coords.longitude);
            } catch (error) {
                console.error("Error getting location:", error);
            }
        };
        getLocation();
    }, []);

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const toRadian = (angle) => (Math.PI / 180) * angle;
        const distanceBetweenPoints = (a, b) => (Math.PI / 180) * (a - b);

        const R = 6371; // Earth radius in kilometers
        const dLat = distanceBetweenPoints(lat2, lat1);
        const dLon = distanceBetweenPoints(lon2, lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadian(lat1)) *
                Math.cos(toRadian(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return (R * c).toFixed(2); // Distance in kilometers
    }
    const profileImageSource = doctor.profilePhoto
        ? { uri: doctor.profilePhoto }
        : require("../assets/images/avatar6.png");

    return (
        // <TouchableOpacity className="bg-white p-4 py-2 rounded-xl mb-4 shadow-lg" onPress={onPress}>
        //     <View className="flex-row items-center mb-4">
        //         <Image
        //             source={profileImageSource}
        //             className="w-16 h-16 rounded-full"
        //         />
        //         <View className="ml-4 flex-1">
        //             <Text className="text-blue-600 text-lg font-poppins-semibold">
        //                 {doctor.doctorName}
        //             </Text>
        //             <Text className="text-gray-500 text-base font-poppins-regular">
        //                 {doctor.specialization}
        //             </Text>
        //             <Text className="text-gray-500 text-sm font-poppins-regular">
        //                 {doctor.hospitalName}
        //             </Text>
        //             <Text className="text-gray-500 text-sm font-poppins-regular">
        //                 Experience: {doctor.experience} Years
        //             </Text>
        //         </View>
        //     </View>
        //     <View className="flex-row justify-between items-center">
        //         {/* <View className="flex-row items-center">
        //             <Ionicons name="location" size={16} color="#2563eb" />
        //             <Text className="text-gray-500 text-sm ml-1 font-poppins-regular">
        //                 {doctor.city}, {doctor.state}
        //             </Text>
        //         </View> */}
        //         <Text className="text-blue-600 text-lg font-poppins-semibold">
        //             ₹{doctor.fees}
        //         </Text>
        //         <Text className="font-poppins-regular text-neutral-700 text-base">
        //             {calculateDistance(
        //                 userLat,
        //                 userLon,
        //                 doctor.location.coordinates[1],
        //                 doctor.location.coordinates[0]
        //             )}{" "}
        //             km
        //         </Text>
        //     </View>
        // </TouchableOpacity>
        <TouchableOpacity
            className="bg-white p-4 rounded-xl mb-4 shadow-lg"
            onPress={onPress}
        >
            <View className="flex-row items-center">
                <Image
                    source={profileImageSource}
                    className="w-16 h-16 rounded-full"
                />
                <View className="ml-4 flex-1">
                    <Text className="text-blue-600 text-lg font-poppins-semibold">
                        {doctor.doctorName}
                    </Text>
                    <Text className="text-gray-500 text-base font-poppins-regular">
                        {doctor.specialization}
                    </Text>
                    <Text className="text-gray-500 text-sm font-poppins-regular">
                        {doctor.hospitalName}
                    </Text>
                    <Text className="text-gray-500 text-sm font-poppins-regular">
                        {doctor.experience} years of experience
                    </Text>
                </View>
            </View>

            <View className="flex-row justify-between items-center mt-4">
                <Text className="text-blue-600 text-lg font-poppins-semibold">
                    ₹{doctor.fees}
                </Text>

                <View className="flex-row items-center">
                    <Ionicons name="location" size={16} color="#3B82F6" />

                    <Text className="text-blue-600 font-poppins-semibold ">
                        {calculateDistance(
                            userLat,
                            userLon,
                            doctor.location.coordinates[1],
                            doctor.location.coordinates[0]
                        )}{" "}
                        km
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
