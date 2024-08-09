import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const DoctorCard = ({ doctor, onPress }) => {
    return (
        <TouchableOpacity
            className="bg-white p-4 rounded-xl mb-4 shadow-lg"
            onPress={onPress}
        >
            <View className="flex-row items-center">
                <Image
                    source={{uri: doctor.profilePhoto}}
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

                <View className="flex-row items-start">
                    <Ionicons name="location" size={16} style={{padding:1.5}} color="#3B82F6" />

                    <Text className="text-blue-600 font-poppins-semibold">
                        {doctor.distanceInKm ? `${doctor.distanceInKm.toFixed(2)} km` : "N/A"} 
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
