import React from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const DoctorInfo = () => {
    const navigation = useNavigation();
    const route = useRoute();
    let { doctor }: any = route.params;
    doctor = JSON.parse(doctor);

    // function that provides google maps link to the doctors chamber
    const openMapsWithDirections = () => {
        const doctorLat = doctor.location.coordinates[1];
        const doctorLon = doctor.location.coordinates[0];
        const url = `https://www.google.com/maps/dir/?api=1&destination=${doctorLat},${doctorLon}`;
        Linking.openURL(url);
    };
    
    const handleBookAppointment = () => {
        // @ts-ignore
        navigation.navigate("AppointmentBooking", {
            doctor: JSON.stringify(doctor),
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-blue-50">
            <ScrollView className="p-4">
                <View className="items-center mb-6 mt-10 pt-5">
                    <Image
                        source={
                            (doctor.profilePhoto = { uri: doctor.profilePhoto })
                        }
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
                    <Text className="text-gray-600 font-poppins-regular text-base">
                        {doctor.experience} Years
                    </Text>
                </View>

                <View className="bg-white p-4 rounded-2xl shadow-md mb-4">
                    <Text className="font-poppins-bold text-blue-700 text-lg mb-2">
                        Location
                    </Text>
                    <Text className="text-gray-600 text-base font-poppins-regular">
                        {doctor.hospitalName}
                    </Text>
                    <Text className="text-gray-600 text-base font-poppins-regular">
                        {doctor.hospitalAddress}
                    </Text>
                    <Text className="text-gray-600 text-base font-poppins-regular">
                        {doctor.city}, {doctor.state}
                    </Text>
                </View>

                <View className="bg-white p-4 rounded-2xl shadow-md mb-4">
                    <Text className="font-poppins-bold text-blue-700 text-lg mb-2">
                        Fees
                    </Text>
                    <Text className="text-gray-600 font-poppins-regular text-base">
                        ₹{doctor.fees}
                    </Text>
                </View>
                <View className="flex flex-row justify-between items-center w-full">
                    <TouchableOpacity
                        onPress={openMapsWithDirections}
                        className="bg-blue-600 py-3 rounded-lg px-4 text-center flex items-center flex-row"
                    >
                        <Ionicons
                            name="location"
                            size={18}
                            style={{ padding: 1.5 }}
                            color="#fff"
                        />
                        <Text className="text-white text-center text-base font-poppins-semibold ml-1">
                            Get Directions
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-blue-600 py-3 px-4 rounded-lg shadow-md w-fit"
                        onPress={handleBookAppointment}
                    >
                        <Text className="text-white text-center font-poppins-semibold text-base">
                            Book Appointment
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DoctorInfo;
