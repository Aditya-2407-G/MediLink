import React from "react";
import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export const AppointmentCard = ({ appointment: { item }, fetchAppointments }) => {
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.getMonth(); // 0-based index
        const year = date.getFullYear();

        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "June",
            "July",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        return `${day} ${months[month]} ${year}`;
    }

    function suffix(time) {
        let temp = time.split("-")[0].split(":")[0];
        return temp > 8 && temp < 12 ? " A.M" : " P.M";
    }

    function formatTime2(time) {
        return time.split("-")[0] + suffix(time.split("-")[0]);
    }

    function formatTime(time) {
        return (
            time.split("-")[0] +
            suffix(time.split("-")[0]) +
            "-" +
            time.split("-")[1] +
            suffix(time.split("-")[1])
        );
    }
    
    const openMapsWithDirections = () => {
        const doctorLat = item.doctor_id.location.coordinates[1];
        const doctorLon = item.doctor_id.location.coordinates[0];
        const url = `https://www.google.com/maps/dir/?api=1&destination=${doctorLat},${doctorLon}`;
        Linking.openURL(url);
    }
    
    

    const cancelAppointment = async () => {
        try {

            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/appointment/cancel`, {
                params: {
                    appointmentId: item._id
                }
            })
            return response;
        } catch (err) {
            console.log("Error in cancelling appointment: ", err)
        } finally {
            fetchAppointments()
        }
    }

    return (
        <TouchableOpacity className="bg-white p-4 rounded-xl mb-4 shadow-lg">
            <View className="flex-row items-center">
                <View className="flex-1">
                    <View className="flex flex-row justify-between items-center">
                        <Text className="text-blue-600 text-lg font-poppins-bold">
                            {formatTime2(item.timeSlot)}{" "}
                        </Text>
                        <Text className="text-blue-600 text-lg font-poppins-bold">
                            {formatDate(item.appointmentDate)}
                        </Text>
                    </View>
                    <Text className="text-gray-500 text-lg font-poppins-medium">
                        {item.doctor_id.doctorName}
                    </Text>
                    <Text className="text-gray-500 text-base font-poppins-regular">
                        {item.doctor_id.specialization}
                    </Text>
                    <Text className="text-gray-500 text-base font-poppins-regular">
                        {item.doctor_id.hospitalName},{" "}
                        {item.doctor_id.hospitalAddress}
                    </Text>
                </View>
            </View>

            <View className="flex-row justify-start gap-x-4 items-center mt-2">
                {/* <Text className="text-blue-600 text-base font-poppins-regular">
                    {formatDate(appointment.item.appointmentDate)}
                </Text> */}
                <TouchableOpacity className="flex-row items-start bg-neutral-100 rounded-full px-2 py-2"
                    onPress={cancelAppointment}
                >
                    <Ionicons
                        name="trash"
                        size={18}
                        style={{ padding: 1.5 }}
                        color="#e11d48"
                    />
                    {/* <Text className="text-rose-600 font-poppins-regular text-base">
                        Cancel
                    </Text> */}
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-start bg-neutral-100 rounded-full px-2 py-2"
                    onPress={openMapsWithDirections}
                >
                    <Ionicons
                        name="location"
                        size={18}
                        style={{ padding: 1.5 }}
                        color="#3B82F6"
                    />
                    {/* <Text className="text-blue-600 font-poppins-regular text-base">
                        Navigate
                    </Text> */}
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};
