import React from "react";
import { View, Text, Image, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const DoctorInfo = () => {
    const route = useRoute();
    const { doctor }: any = route.params;

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
                        {doctor.hospitalName}
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
