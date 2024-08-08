import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { debounce } from 'lodash';

const API_URL = "http://192.168.29.57:8000";

const FindDoctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchDoctors = async (query = "") => {
        try {
            const response = await axios.get(
                `${API_URL}/doctor/search?searchTerm=${query}`
            );
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    // Create a debounced version of fetchDoctors
    const debouncedFetchDoctors = useCallback(
        debounce((query) => fetchDoctors(query), 300),
        []
    );

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleSearch = (text) => {
        setSearchQuery(text);
        debouncedFetchDoctors(text);
    };

    const renderDoctorItem = ({ item }) => (
        <TouchableOpacity className="bg-white p-4 rounded-2xl shadow-md mb-4">
            <View className="flex-row items-center mb-3">
                <Image
                    source={{
                        uri: `https://randomuser.me/api/portraits/${
                            item.doctorName.toLowerCase().includes("dr.")
                                ? "men"
                                : "women"
                        }/${Math.floor(Math.random() * 60) + 1}.jpg`,
                    }}
                    className="w-16 h-16 rounded-full"
                />
                <View className="ml-4 flex-1">
                    <Text className="font-poppins-bold text-blue-700 text-lg">
                        {item.doctorName}
                    </Text>
                    <Text className="text-blue-600 font-poppins-regular">
                        {item.specialization}
                    </Text>
                    <Text className="text-gray-600 font-poppins-regular">
                        {item.hospitalName}
                    </Text>
                </View>
            </View>
            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <Ionicons name="location" size={16} color="#3B82F6" />
                    <Text className="text-gray-600 ml-1 font-poppins-regular">
                        {item.city}, {item.state}
                    </Text>
                </View>
                <Text className="text-blue-700 font-poppins-semibold">
                    ₹{item.fees}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-blue-50">
            <View className="p-4">
                <Text className="text-2xl font-poppins-bold text-blue-800 mb-4">
                    Find Doctors
                </Text>
                <View className="bg-white rounded-full flex-row items-center p-4 shadow-md mb-4">
                    <Ionicons name="search" size={24} color="#3B82F6" />
                    <TextInput
                        className="flex-1 ml-3 text-gray-700 text-base font-poppins-regular"
                        placeholder="Search doctors, specialties..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>
                <FlatList
                    data={doctors}
                    renderItem={renderDoctorItem}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            </View>
        </SafeAreaView>
    );
};

export default FindDoctor;
