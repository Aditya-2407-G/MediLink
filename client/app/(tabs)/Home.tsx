import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, RefreshControl, ActivityIndicator, Alert, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { debounce } from "lodash";
import { router } from "expo-router";
import { FilterModal } from "../../components/FilterModal";
import { DoctorCard } from "@/components/DoctorCard";
import * as Location from "expo-location";
import { useAuth } from "@/context/AuthContext";
import {openSettings} from "expo-linking";

const Home = () => {

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({});
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const { logout } = useAuth();

    // fetch initial doctor information on home page based on distance, nearest doctor to the farthest.
    const getLocationAndFetchData = async () => {

        try {
            setLoading(true);
            // ask for location permissions, if not already granted
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status !== "granted") {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();
                    if (status !== "granted") {
                        Alert.alert(
                            "Location Permission Required",
                            "Location access is necessary to find doctors near you. Please go to the app settings and allow location permission.",
                            [
                                {
                                    text: "OK",
                                    onPress: () => BackHandler.exitApp(),
                                },
                                {
                                    text: "Open Settings", 
                                    onPress: () => openSettings()
                                }
                            ]
                        );
                    }
            }
            const { coords } = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = coords;

            // update coordinates in the filtes
            const updatedFilters = {
                ...filters,
                userLat: latitude,
                userLon: longitude,
            };
            setFilters(updatedFilters);

            // call an api to the server, to get some doctors on inital render. Pass location and other filters as params
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_API_URL}/doctor/search`,
                {
                    params: {
                        ...updatedFilters,
                        sortBy: "distance",
                        sortDirection: "asc",
                    },
                }
            );
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors based on location:", error);
        } finally {
            setLoading(false);
        }
    };

    // call the function as soon as the component mounts
    useEffect(() => {
        getLocationAndFetchData();
    }, []);

    // debounced fetch doctors, to ensure the server is not being called in every few seconds for small iterations
    const debouncedFetchDoctors = useCallback(
        debounce(async (query, currentFilters) => {
            if (showFilterModal) return;
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_API_URL}/doctor/search`,
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
            } finally {
                setLoading(false);
            }
        }, 800),
        []
    );

    // call debouncedFetchDoctors function if filter is applied or search query exists
    useEffect(() => {
        if (searchQuery || isFilterApplied) {
            debouncedFetchDoctors(searchQuery, filters);
            setIsFilterApplied(false);
        }
    }, [searchQuery, filters, isFilterApplied, debouncedFetchDoctors]);

    // function to handle search query 
    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    // function to handle filters
    const handleApplyFilters = (newFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
        debouncedFetchDoctors(searchQuery, { ...filters, ...newFilters });
    };

    // function to refresh screen 
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setSearchQuery("")
        getLocationAndFetchData().then(() => setRefreshing(false));
    }, []);

    // function to handle logout
    const handleLogout = async () => {
        try {
            const res = await logout();
            if (res.status === 200) {
                router.replace("/SignIn");
            } else {
                Alert.alert("Sorry", "Logout failed. Please try again.");
            }
        } catch (error) {
            Alert.alert(
                "Sorry",
                "An unexpected error occurred. Please try again."
            );
            console.log("Error in logging out: ", error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-blue-50 pt-5">
            <View className="bg-blue-600 p-10 rounded-b-3xl shadow-lg">
                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-white text-3xl font-poppins-semibold">
                            MediLink
                        </Text>
                        <Text className="text-blue-100 text-base mt-1 font-poppins-light">
                            Your Health, Our Priority
                        </Text>
                    </View>
                    <TouchableOpacity
                        className="bg-blue-500 p-2 rounded-full -mr-2 -mt-1"
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

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

            <View className="mx-4 my-4">
                <Text className="text-xl font-poppins-bold text-blue-800 mb-4">
                    Available Doctors
                </Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#3B82F6" />
                ) : (
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
                        contentContainerStyle={{ paddingBottom: 290 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    />
                )}
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
