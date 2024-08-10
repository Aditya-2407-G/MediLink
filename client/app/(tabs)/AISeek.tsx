import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { DoctorCard } from "@/components/DoctorCard";

const AISeek = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [queryResult, setQueryResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const vectorSearch = async () => {
        setLoading(true);
        console.log("vectorSearch");
        try {
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_API_URL}/doctor/ai-seek`,
                {
                    params: {
                        text: searchQuery,
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
        <SafeAreaView>
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
                    className="bg-neutral-100 py-2 pl-2.5 pr-1.5 rounded-full"
                    onPress={vectorSearch}
                >
                    <Ionicons name="send-sharp" size={20} color="#2563eb" />
                </TouchableOpacity>
            </View>
            <View className="p-4">
                {!loading ? (
                    <FlatList
                        data={queryResult}
                        renderItem={({ item }) => (
                            <DoctorCard doctor={item} onPress={() => console.log('Doctor selected:', item.doctorName)} />
                        )}
                        keyExtractor={(item) => item._id.toString()}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => (
                            <Text className="text-base font-poppins-regular text-neutral-600">
                                No doctors found.
                            </Text>
                        )}
                    />
                ) : (
                    <Text className="text-base font-poppins-regular text-neutral-600">
                        Looking for doctors...
                    </Text>
                )}
            </View>
        </SafeAreaView>
    );
};

export default AISeek;
