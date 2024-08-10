import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { AppointmentCard } from "@/components/AppointmentCard";
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_API_URL}/appointment/upcoming`
            );
            setAppointments(response.data);
        } catch (err) {
            console.log("Error in fetching appointments: ", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const renderHeader = () => (
        <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-poppins-bold text-blue-600">Appointments</Text>
            <TouchableOpacity onPress={fetchAppointments}>
                <Ionicons name="refresh" size={24} color="blue" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-blue-50">
            <View className="px-4 py-4 flex-1 text-base font-poppins-regular">
                {renderHeader()}
                {!loading ? (
                    <FlatList
    data={appointments}
    renderItem={(itemData) => (
        <AppointmentCard
            appointment={itemData}
            fetchAppointments={fetchAppointments}
        />
    )}
    keyExtractor={(item) => item._id.toString()}
    showsVerticalScrollIndicator={false}
    ListEmptyComponent={() => (
        <Text>No appointments found</Text>
    )}
/>
                ) : (
                    <Text className="text-base font-poppins-regular text-neutral-600">Fetching appointments..</Text>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Appointments;