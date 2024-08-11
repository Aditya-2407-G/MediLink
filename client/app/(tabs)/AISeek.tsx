import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    BackHandler,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { DoctorCard } from "@/components/DoctorCard";
import * as Location from "expo-location";
import { openSettings } from "expo-linking";
import { router } from "expo-router";

const AISeek = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [queryResult, setQueryResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    // get user location
    const getLocation = async () => {
        try {
            // Check if location permission is granted
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
            // Get the current location
            const currentLocation = await Location.getCurrentPositionAsync({});
            setLatitude(currentLocation["coords"]["latitude"]);
            setLongitude(currentLocation["coords"]["longitude"]);
        } catch (error) {
            console.error("Error getting location:", error);
        }
    };

    // function that handles search based on user query
    const vectorSearch = async () => {
        setLoading(true);
        await getLocation();
        try {
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_API_URL}/doctor/ai-seek`,
                {
                    params: {
                        text: searchQuery,
                        latitude,
                        longitude,
                    },
                }
            );
            setQueryResult(response.data);
        } catch (error) {
            console.error("Error during vector search:", error);
        }
        setLoading(false);
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    return (
        <SafeAreaView className="flex-1 bg-blue-50">
            <View className="bg-white mx-4 mt-6 rounded-full flex-row items-center p-4 shadow-lg">
                <Ionicons name="search" size={24} color="#3B82F6" />
                <TextInput
                    className="flex-1 text-gray-700 text-base mx-3 font-poppins-regular"
                    placeholder="Search symptoms"
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity
                    className="rounded-full bg-neutral-100 py-2 pl-2.5 pr-1.5"
                    onPress={vectorSearch}
                >
                    <Ionicons name="send-sharp" size={22} color="#3B82F6" />
                </TouchableOpacity>
            </View>
            <View className="p-4">
                {!loading ? (
                    <FlatList
                        data={queryResult}
                        renderItem={({ item }) => (
                            <DoctorCard
                                doctor={item}
                                onPress={() => 
                                    router.push({
                                        pathname: "/DoctorInfo",
                                        params: {
                                            doctor: JSON.stringify(item),
                                        }
                                    })
                                }
                            />
                        )}
                        keyExtractor={(item) => item._id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 150 }}
                        ListEmptyComponent={() => (
                            <Text className="text-base font-poppins-regular text-neutral-600">
                                Write your symptoms to get doctor suggestions.
                            </Text>
                        )}
                    />
                ) : (
                    <View className="flex flex-col gap-4    ">
                        <Text className="text-base font-poppins-regular text-red-600">
                            Disclaimer: This feature is in beta and still under
                            development. Doctor suggestions may not be fully
                            accurate or reliable. Please consult a healthcare
                            professional directly for any medical concerns.
                        </Text>
                        <Text className="text-base font-poppins-regular text-neutral-600">
                            Looking for doctors...
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default AISeek;
