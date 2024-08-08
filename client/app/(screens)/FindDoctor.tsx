import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { debounce } from "lodash";
import { useNavigation } from "@react-navigation/native";
import { FilterModal } from "../../components/FilterModal";
import { DoctorCard } from "@/components/DoctorCard";
import * as Location from "expo-location";

const FindDoctor = () => {
    const navigation = useNavigation();
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({});
    const [isFilterApplied, setIsFilterApplied] = useState(false);

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
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    userLat: coords.latitude,
                    userLon: coords.longitude,
                }));
            } catch (error) {
                console.error("Error getting location:", error);
            }
        };
        getLocation();
    }, []); // Empty dependency array to only run on component mount

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_API_URL}/doctor/temp-doctor-data`
                );
                setDoctors(response.data);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };
        fetchInitialData();
    }, []);

    // Fetch doctors with debounce for search query
    const debouncedFetchDoctors = useCallback(
        debounce(async (query, filters) => {
            if (showFilterModal) {
                return;
            }
            try {
                console.log("API IS BEING CALLED");
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_API_URL}/doctor/search`,
                    {
                        params: {
                            searchTerm: query,
                            ...filters,
                        },
                    }
                );
                setDoctors(response.data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        }, 800),
        [showFilterModal, filters]
    );

    useEffect(() => {
        debouncedFetchDoctors(searchQuery, filters);
    }, [searchQuery, filters, debouncedFetchDoctors]);

    useEffect(() => {
        if (isFilterApplied) {
            debouncedFetchDoctors(searchQuery, filters);
            setIsFilterApplied(false);
        }
    }, [filters, isFilterApplied, debouncedFetchDoctors, searchQuery]);

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const handleApplyFilters = (newFilters) => {
        console.log(newFilters);
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
        debouncedFetchDoctors(searchQuery, { ...filters, ...newFilters });
    };
    return (
        <SafeAreaView className="flex-1 bg-blue-50 p-3 px-0">
            <View className="bg-white p-5 rounded-[40px] rounded-t-none mb-5 mt-8 w-full">
                <Text className="text-blue-500 text-2xl font-bold mb-4 font-poppins-semibold">
                    Find Doctors
                </Text>
                <View className="bg-[#f5f5f5] rounded-full flex-row items-center p-3 shadow-sm">
                    <Ionicons name="search" size={24} color="#3b82f6" />
                    <TextInput
                        className="flex-1 text-gray-700 text-base mx-3 font-poppins-regular"
                        placeholder="Search doctors, specialties..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    <TouchableOpacity
                        className="bg-blue-500 p-3 rounded-full"
                        onPress={() => setShowFilterModal(true)}
                    >
                        <Ionicons name="options" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={doctors}
                renderItem={({ item }) => (
                    <DoctorCard
                        doctor={item}
                        onPress={() =>
                            //   @ts-ignore
                            navigation.navigate("DoctorInfo", { doctor: item })
                        }
                    />
                )}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 10 }}
            />
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

export default FindDoctor;
