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
import { debounce } from "lodash";
import { useNavigation } from "@react-navigation/native";
import { FilterModal } from "../../components/FilterModal";

const DoctorCard = ({ doctor, onPress }) => {
  return (
    <TouchableOpacity
      className="bg-white p-3 rounded-lg mb-5 shadow-lg"
      onPress={onPress}
    >
      <View className="flex-row items-center mb-3">
        <Image
          source={{
            uri: `https://randomuser.me/api/portraits/${
              doctor.doctorName.toLowerCase().includes("dr.") ? "men" : "women"
            }/${Math.floor(Math.random() * 60) + 1}.jpg`,
          }}
          className="w-12 h-12 rounded-full"
        />
        <View className="ml-4 flex-1">
          <Text className="font-bold text-[#1D4ED8] text-lg">
            {doctor.doctorName}
          </Text>
          <Text className="text-gray-500 text-base">{doctor.specialization}</Text>
          <Text className="text-gray-500 text-sm">{doctor.hospitalName}</Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="location" size={16} color="#1D4ED8" />
          <Text className="text-gray-500 text-sm ml-1">
            {doctor.city}, {doctor.state}
          </Text>
        </View>
        <Text className="text-[#1D4ED8] font-bold text-lg">
          ₹{doctor.fees}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const FindDoctor = () => {
  const navigation = useNavigation();
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [availableSpecialties, setAvailableSpecialties] = useState([]);
  const [filters, setFilters] = useState({
    rating: 0,
    priceRange: [0, 1000],
    distance: 50,
    experience: 5,
    sortBy: 'distance',
    specializations: [],
  });

  const fetchDoctors = async (query = "", filters = {}) => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/doctor/search`, {
        params: {
          searchTerm: query,
          ...filters,
        },
      });
      setDoctors(response.data);
      setAvailableSpecialties(response.data.map((doctor) => doctor.specialization));
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const debouncedFetchDoctors = useCallback(
    debounce((query, filters) => fetchDoctors(query, filters), 800),
    [filters]
  );

  useEffect(() => {
    debouncedFetchDoctors(searchQuery, filters);
  }, [debouncedFetchDoctors, searchQuery, filters]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    debouncedFetchDoctors(text, filters);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredDoctors = filters.specializations.length > 0
    ? doctors.filter((doctor) => filters.specializations.includes(doctor.specialization))
    : doctors;

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB] p-3">
      <View className="bg-white p-5 rounded-lg mb-5 mt-8 w-full">
        <Text className="text-[#1D4ED8] text-2xl font-bold mb-4">
          Find Doctors
        </Text>
        <View className="bg-[#F9FAFB] rounded-full flex-row items-center p-3 shadow-sm">
          <Ionicons name="search" size={24} color="#1D4ED8" />
          <TextInput
            className="flex-1 text-gray-700 text-base mx-3"
            placeholder="Search doctors, specialties..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity
            className="bg-[#1D4ED8] p-3 rounded-full"
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="options" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={filteredDoctors}
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            //@ts-ignore
            onPress={() => navigation.navigate("DoctorInfo", { doctor: item })}
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
          availableSpecialties={availableSpecialties}
        />
      )}
    </SafeAreaView>
  );
};

export default FindDoctor;
