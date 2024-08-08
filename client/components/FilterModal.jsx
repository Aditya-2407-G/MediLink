import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    Pressable,
} from "react-native";
import Slider from "@react-native-community/slider";
import * as Location from "expo-location"; // Ensure you have this installed

export const FilterModal = ({
    filters,
    handleApplyFilters,
    setShowFilterModal,
}) => {
    const [sortDirection, setSortDirection] = useState(
        filters.sortDirection || "asc"
    );
    const [selectedSpecialties, setSelectedSpecialties] = useState(
        filters.specialties || []
    );
    const [sortBy, setSortBy] = useState(filters.sortBy || "");
    const [fees, setFees] = useState(filters.fees || 5000);
    const [distance, setDistance] = useState(filters.distance || 50);
    const [experience, setExperience] = useState(filters.experience || 0);
    const [locationPermission, setLocationPermission] = useState(false);

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
                setLocationPermission(true);

                // Get the current location
                const { coords } = await Location.getCurrentPositionAsync({});
                handleApplyFilters((prevFilters) => ({
                    ...prevFilters,
                    userLat: coords.latitude,
                    userLon: coords.longitude,
                }));
            } catch (error) {
                console.error("Error getting location:", error);
            }
        };
        getLocation();
    }, []);

    const handleSortSelection = (criteria) => {
        setSortBy(criteria);
        handleApplyFilters({ ...filters, sortBy: criteria, sortDirection });
    };

    const handleSortDirectionChange = () => {
        const newDirection = sortDirection === "asc" ? "desc" : "asc";
        setSortDirection(newDirection);
        handleApplyFilters({ ...filters, sortDirection: newDirection });
    };

    const handleSpecialtySelect = (specialty) => {
        if (selectedSpecialties.includes(specialty)) {
            setSelectedSpecialties(
                selectedSpecialties.filter((item) => item !== specialty)
            );
        } else {
            setSelectedSpecialties([...selectedSpecialties, specialty]);
        }
    };

    const handleRemoveFilter = (filterKey) => {
        switch (filterKey) {
            case "fees":
                setFees(5000);
                break;
            case "distance":
                setDistance(50);
                break;
            case "experience":
                setExperience(0);
                break;
            case "sortBy":
                setSortBy("");
                setSortDirection("asc");
                break;
            case "specialties":
                setSelectedSpecialties([]);
                break;
            default:
                break;
        }
        handleApplyFilters({
            ...filters,
            [filterKey]:
                filterKey === "specialties"
                    ? []
                    : filterKey === "sortBy"
                    ? ""
                    : filterKey === "sortDirection"
                    ? "asc"
                    : filterKey === "fees"
                    ? 5000
                    : filterKey === "distance"
                    ? 50
                    : filterKey === "experience"
                    ? 0
                    : filters[filterKey],
        });
    };

    return (
        <Modal visible transparent animationType="slide">
            <View className="flex-1 bg-[rgba(0,0,0,0.5)] justify-end">
                <View className="bg-white rounded-t-2xl pt-6 pb-12 px-6">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-2xl font-poppins-semibold">
                            Filters
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowFilterModal(false)}
                        >
                            <Text className="text-[#2563eb] font-poppins-regular text-base">
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="mb-6">
                            <Text className="text-lg font-poppins-medium text-neutral-600 mb-2">
                                Fees under
                            </Text>
                            <Slider
                                style={{ width: "100%" }}
                                minimumValue={0}
                                maximumValue={5000}
                                step={10}
                                value={fees}
                                minimumTrackTintColor="#2563eb"
                                maximumTrackTintColor="#60a5fa"
                                thumbTintColor="#2563eb"
                                onValueChange={(value) => setFees(value)}
                                onSlidingComplete={() =>
                                    handleApplyFilters({ ...filters, fees })
                                }
                            />
                            <View className="flex flex-row justify-between items-center">
                                <Text className="text-[#2563eb] font-poppins-regular text-base mt-2">
                                    ₹{fees}
                                </Text>
                                {filters.fees != undefined &&
                                    filters.fees != 5000 && (
                                        <TouchableOpacity
                                            onPress={() =>
                                                handleRemoveFilter("fees")
                                            }
                                        >
                                            <Text className="text-red-500 text-base mt-2">
                                                Remove Fees Filter
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                            </View>
                        </View>

                        {locationPermission && (
                            <View className="mb-6">
                                <Text className="text-lg font-poppins-medium text-neutral-600 mb-2">
                                    Distance under
                                </Text>
                                <Slider
                                    className="w-full"
                                    minimumValue={0}
                                    maximumValue={100}
                                    step={1}
                                    value={distance}
                                    minimumTrackTintColor="#2563eb"
                                    maximumTrackTintColor="#60a5fa"
                                    thumbTintColor="#2563eb"
                                    onValueChange={(value) =>
                                        setDistance(value)
                                    }
                                    onSlidingComplete={() =>
                                        handleApplyFilters({
                                            ...filters,
                                            distance,
                                        })
                                    }
                                />
                                <View className="flex flex-row justify-between items-center">
                                    <Text className="text-[#2563eb] font-poppins-regular text-base mt-2">
                                        {distance} km
                                    </Text>
                                    {filters.distance != undefined &&
                                        filters.distance != 50 && (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleRemoveFilter(
                                                        "distance"
                                                    )
                                                }
                                            >
                                                <Text className="text-red-500 text-base mt-2">
                                                    Remove Distance Filter
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                </View>
                            </View>
                        )}

                        <View className="mb-6">
                            <Text className="text-lg font-poppins-medium text-neutral-600 mb-2">
                                Experience over
                            </Text>
                            <Slider
                                className="w-full"
                                minimumValue={0}
                                maximumValue={60}
                                step={1}
                                value={experience}
                                minimumTrackTintColor="#2563eb"
                                maximumTrackTintColor="#60a5fa"
                                thumbTintColor="#2563eb"
                                onValueChange={(value) => setExperience(value)}
                                onSlidingComplete={() =>
                                    handleApplyFilters({
                                        ...filters,
                                        experience,
                                    })
                                }
                            />
                            <View className="flex flex-row justify-between items-center">
                                <Text className="text-[#2563eb] font-poppins-regular text-base mt-2">
                                    {experience} years
                                </Text>
                                {filters.experience != undefined &&
                                    filters.experience != 0 && (
                                        <TouchableOpacity
                                            onPress={() =>
                                                handleRemoveFilter("experience")
                                            }
                                        >
                                            <Text className="text-red-500 text-base mt-2">
                                                Remove Experience Filter
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="text-lg font-poppins-medium text-neutral-600 mb-2">
                                Sort By
                            </Text>
                            <View className="flex-row flex">
                                <Pressable
                                    className={`px-4 py-2 rounded-lg flex-grow mr-2 ${
                                        sortBy === "fees"
                                            ? "bg-[#2563eb] text-white"
                                            : "bg-[#F3F4F6] text-[#2563eb]"
                                    }`}
                                    onPress={() => handleSortSelection("fees")}
                                >
                                    <Text
                                        className={`text-center text-base ${
                                            sortBy === "fees"
                                                ? "text-white"
                                                : "text-[#2563eb]"
                                        } font-poppins-regular`}
                                    >
                                        Fees
                                    </Text>
                                </Pressable>
                                <Pressable
                                    className={`px-4 py-2 rounded-lg flex-grow mr-2 ${
                                        sortBy === "distance"
                                            ? "bg-[#2563eb] text-white"
                                            : "bg-[#F3F4F6] text-[#2563eb]"
                                    }`}
                                    onPress={() =>
                                        handleSortSelection("distance")
                                    }
                                    disabled={!locationPermission}
                                >
                                    <Text
                                        className={`text-center text-base ${
                                            sortBy === "distance"
                                                ? "text-white"
                                                : "text-[#2563eb]"
                                        } font-poppins-regular`}
                                    >
                                        Distance
                                    </Text>
                                </Pressable>
                                <Pressable
                                    className={`px-4 py-2 rounded-lg flex-grow mr-2 ${
                                        sortBy === "experience"
                                            ? "bg-[#2563eb] text-white"
                                            : "bg-[#F3F4F6] text-[#2563eb]"
                                    }`}
                                    onPress={() =>
                                        handleSortSelection("experience")
                                    }
                                >
                                    <Text
                                        className={`text-center text-base ${
                                            sortBy === "experience"
                                                ? "text-white"
                                                : "text-[#2563eb]"
                                        } font-poppins-regular`}
                                    >
                                        Experience
                                    </Text>
                                </Pressable>
                            </View>
                            {sortBy && (
                                <View className="mt-4 flex flex-col gap-x-4 items-center">
                                    <View className="flex flex-row items-center justify-between space-x-2">
                                        <Pressable
                                            className={`px-4 py-2 rounded-lg flex-grow ${
                                                sortDirection === "asc"
                                                    ? "bg-[#2563eb] text-white"
                                                    : "bg-[#F3F4F6] text-[#2563eb]"
                                            }`}
                                            onPress={() =>
                                                handleSortDirectionChange("asc")
                                            }
                                        >
                                            <Text
                                                className={`text-center text-base ${
                                                    sortDirection === "asc"
                                                        ? "text-white"
                                                        : "text-[#2563eb]"
                                                } font-poppins-regular`}
                                            >
                                                Ascending
                                            </Text>
                                        </Pressable>
                                        <Pressable
                                            className={`px-4 py-2 rounded-lg flex-grow ${
                                                sortDirection === "desc"
                                                    ? "bg-[#2563eb] text-white"
                                                    : "bg-[#F3F4F6] text-[#2563eb]"
                                            }`}
                                            onPress={() =>
                                                handleSortDirectionChange(
                                                    "desc"
                                                )
                                            }
                                        >
                                            <Text
                                                className={`text-center text-base ${
                                                    sortDirection === "desc"
                                                        ? "text-white"
                                                        : "text-[#2563eb]"
                                                } font-poppins-regular`}
                                            >
                                                Descending
                                            </Text>
                                        </Pressable>
                                    </View>
                                    {filters.sortBy && (
                                        <TouchableOpacity
                                            onPress={() =>
                                                handleRemoveFilter("sortBy")
                                            }
                                        >
                                            <Text className="text-red-500 text-base mt-2">
                                                Remove Sort Filter
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            className="bg-[#2563eb] rounded-lg py-3"
                            onPress={() => {
                                handleApplyFilters({
                                    sortBy,
                                    sortDirection,
                                    fees,
                                    distance,
                                    experience,
                                    specialties: selectedSpecialties,
                                });
                                setShowFilterModal(false);
                            }}
                        >
                            <Text className="text-center text-white text-base font-poppins-semibold">
                                Apply Filters
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
