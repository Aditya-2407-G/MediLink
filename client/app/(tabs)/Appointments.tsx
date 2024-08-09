import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { AppointmentCard } from "@/components/AppointmentCard";

const Appointments = () => {
    const [appointments, setAppointments] = useState();
    const [loading, setLoading] = useState(true);
    const fetchAppointments = async () => {
        try {
            const response = await axios.get(
                "http://192.168.0.174:8000/appointment/upcoming"
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

    return (
        <SafeAreaView>
            <View className="px-4 py-4 bg-blue-50">
                {!loading ? (
                    <FlatList
                        data={appointments}
                        renderItem={(item) => (
                            <AppointmentCard
                                appointment={item}
                                fetchAppointments={fetchAppointments}
                            />
                        )}
                        keyExtractor={(_, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => (
                            <Text>No appointments found</Text>
                        )}
                    />
                ) : (
                    <Text>Fetching appointments..</Text>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Appointments;
