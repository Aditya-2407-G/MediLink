import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { debounce } from "lodash";
import { router } from "expo-router";
import { FilterModal } from "../../components/FilterModal";
import { DoctorCard } from "@/components/DoctorCard";
import * as Location from "expo-location";


const Home = () => {
    
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({});
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Get user's current location and fetch initial data
    const getLocationAndFetchData = async () => {
        try {
            // Check if location permission is granted
            const { status } = await Location.getForegroundPermissionsAsync();
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
            const { latitude, longitude } = coords;

            // Set location in filters
            const updatedFilters = {
                ...filters,
                userLat: latitude,
                userLon: longitude,
            };
            setFilters(updatedFilters);

            // Fetch initial data based on location
            const response = await axios.get(
                `http://192.168.0.174:8000/doctor/search`, // Use your appropriate endpoint
                {
                    params: {
                        ...updatedFilters,
                        sortBy: "distance", // Sort by distance from the user's location
                        sortDirection: "asc", // Closest to farthest
                    },
                }
            );
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors based on location:", error);
        }
    };

    useEffect(() => {
        getLocationAndFetchData(); // Call this only on initial render
    }, []); // Empty dependency array ensures this only runs on initial render

    // Debounced fetch doctors for search and filter updates
    const debouncedFetchDoctors = useCallback(
        debounce(async (query, currentFilters) => {
            if (showFilterModal) return;
            try {
                const response = await axios.get(
                    `http://192.168.0.174:8000/doctor/search`,
                    {
                        params: {
                            searchTerm: query,
                            ...currentFilters,
                        },
                    }
                );
                setDoctors(response.data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        }, 800),
        []
    );

    useEffect(() => {
        if (searchQuery || isFilterApplied) {
            debouncedFetchDoctors(searchQuery, filters);
            setIsFilterApplied(false);
        }
    }, [searchQuery, filters, isFilterApplied, debouncedFetchDoctors]);

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const handleApplyFilters = (newFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
        debouncedFetchDoctors(searchQuery, { ...filters, ...newFilters });
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getLocationAndFetchData().then(() => setRefreshing(false));
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-blue-50 pt-5">
            {/* Header */}
            <View className="bg-blue-600 p-10 rounded-b-3xl shadow-lg">
                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-white text-3xl font-poppins-medium">
                            MediLink
                        </Text>
                        <Text className="text-blue-100 text-base mt-1 font-poppins-light">
                            Your Health, Our Priority
                        </Text>
                    </View>
                    <TouchableOpacity className="bg-blue-500 p-2 rounded-full">
                        <Ionicons name="log-out" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View className="bg-white mx-4 -mt-6 rounded-full flex-row items-center p-4 shadow-lg">
                <Ionicons name="search" size={24} color="#3B82F6" />
                <TextInput
                    className="flex-1 text-gray-700 text-base mx-3 font-poppins-regular"
                    placeholder="Search doctors, specialties..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity
                    className="bg-blue-500 p-2 rounded-full"
                    onPress={() => setShowFilterModal(true)}
                >
                    <Ionicons name="options" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Doctors List */}
            <View className="mx-4 my-4">
                <Text className="text-xl font-poppins-bold text-blue-800 mb-4">
                    Available Doctors
                </Text>
                <FlatList
                    data={doctors}
                    renderItem={({ item }) => (
                        <DoctorCard
                            doctor={item}
                            onPress={() =>
                                router.push({
                                    pathname: "/DoctorInfo",
                                    params: {
                                        doctor: JSON.stringify(item),
                                    },
                                })
                            }
                        />
                    )}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
            </View>

            {showFilterModal && (
                <FilterModal
                    filters={filters}
                    handleApplyFilters={handleApplyFilters}
                    setShowFilterModal={setShowFilterModal}
                />
            )}
        </SafeAreaView>
    );
};

export default Home;
