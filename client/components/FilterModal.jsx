import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Image, Modal, Dimensions, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";


export const FilterModal = ({ filters, handleApplyFilters, setShowFilterModal, availableSpecialties }) => {
    const [sortDirection, setSortDirection] = useState("asc");
    const [selectedSpecialties, setSelectedSpecialties] = useState(filters.specialties || []);
    
    const handleSortByPrice = () => {
      handleApplyFilters({ ...filters, sortBy: 'price', sortDirection });
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };
    
    const handleSpecialtySelect = (specialty) => {
      if (selectedSpecialties.includes(specialty)) {
        setSelectedSpecialties(selectedSpecialties.filter(item => item !== specialty));
      } else {
        setSelectedSpecialties([...selectedSpecialties, specialty]);
      }
    };
    
    return (
      <Modal visible transparent animationType="slide">
          <View className="flex-1 bg-[rgba(0,0,0,0.5)] justify-end">
              <View className="bg-white rounded-t-2xl pt-6 pb-12 px-6">
                  <View className="flex-row justify-between items-center mb-6">
                      <Text className="text-2xl font-bold">Filters</Text>
                      <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                          <Ionicons name="close" size={24} color="#4B5563" />
                      </TouchableOpacity>
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false}>
                      <View className="mb-6">
                          <Text className="text-lg font-bold mb-2">Rating</Text>
                          <Slider
                              className="w-full"
                              minimumValue={0}
                              maximumValue={5}
                              step={0.1}
                              value={filters.rating}
                              onValueChange={(value) => handleApplyFilters({ ...filters, rating: value })}
                              />
                          <Text className="text-[#4B5563] mt-2">Rating: {filters.rating.toFixed(1)}</Text>
                      </View>

                      <View className="mb-6">
                          <Text className="text-lg font-bold mb-2">Price</Text>
                          <View className="flex-row justify-between items-center">
                              <TouchableOpacity
                                  className={`px-4 py-2 rounded-lg ${filters.sortBy === 'price' && sortDirection === 'asc' ? 'bg-[#3B82F6] text-white' : 'bg-[#F3F4F6] text-[#4B5563]'}`}
                                  onPress={handleSortByPrice}
                                  >
                                  <Text>Low to High</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                  className={`px-4 py-2 rounded-lg ${filters.sortBy === 'price' && sortDirection === 'desc' ? 'bg-[#3B82F6] text-white' : 'bg-[#F3F4F6] text-[#4B5563]'}`}
                                  onPress={handleSortByPrice}
                                  >
                                  <Text>High to Low</Text>
                              </TouchableOpacity>
                          </View>
                          <View className="flex-row justify-evenly items-center mt-4">
                              <TouchableOpacity
                                  className={`px-4 py-2 rounded-lg ${filters.priceRange[0] === 0 && filters.priceRange[1] === 500 ? 'bg-[#3B82F6] text-white' : 'bg-[#F3F4F6] text-[#4B5563]'}`}
                                  onPress={() => handleApplyFilters({ ...filters, priceRange: [0, 500] })}
                              >
                                  <Text>₹0 - ₹500</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                  className={`px-4 py-2 rounded-lg ${filters.priceRange[0] === 500 && filters.priceRange[1] === 1000 ? 'bg-[#3B82F6] text-white' : 'bg-[#F3F4F6] text-[#4B5563]'}`}
                                  onPress={() => handleApplyFilters({ ...filters, priceRange: [500, 1000] })}
                                  >
                                  <Text>₹500 - ₹1000</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                  className={`px-4 py-2 rounded-lg ${filters.priceRange[0] === 1000 && filters.priceRange[1] === Infinity ? 'bg-[#3B82F6] text-white' : 'bg-[#F3F4F6] text-[#4B5563]'}`}
                                  onPress={() => handleApplyFilters({ ...filters, priceRange: [1000, Infinity] })}
                                  >
                                  <Text>₹1000+</Text>
                              </TouchableOpacity>
                          </View>
                      </View>

                      <View className="mb-6">
                          <Text className="text-lg font-bold mb-2">Distance</Text>
                          <Slider
                              className="w-full"
                              minimumValue={0}
                              maximumValue={100}
                              step={1}
                              value={filters.distance}
                              onValueChange={(value) => handleApplyFilters({ ...filters, distance: value })}
                              />
                          <Text className="text-[#4B5563] mt-2">Distance: {filters.distance} km</Text>
                      </View>

                      <View className="mb-6">
                          <Text className="text-lg font-bold mb-2">Experience</Text>
                          <Slider
                              className="w-full"
                              minimumValue={0}
                              maximumValue={30}
                              step={1}
                              value={filters.experience}
                              onValueChange={(value) => handleApplyFilters({ ...filters, experience: value })}
                              />
                          <Text className="text-[#4B5563] mt-2">Experience: {filters.experience} years</Text>
                      </View>

                      <View className="mb-6">
            <Text className="text-lg font-bold mb-2">Specialty</Text>
            <View className="flex-wrap flex-row">
                {availableSpecialties.map((specialty, index) => (
                    <Pressable
                        key={index}
                        className={`px-4 py-2 rounded-lg mr-2 mb-2 ${selectedSpecialties.includes(specialty) ? 'bg-[#3B82F6] text-white' : 'bg-[#F3F4F6] text-[#4B5563]'}`}
                        onPress={() => handleSpecialtySelect(specialty)}
                    >
                        <Text>{specialty}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
                  </ScrollView>

                  <View className="flex-row justify-around mt-6">
                      <TouchableOpacity
                          className="bg-[#3B82F6] px-4 py-2 rounded-lg"
                          onPress={() => {
                              handleApplyFilters({ ...filters, specialties: selectedSpecialties });
                              setShowFilterModal(false);
                            }}
                            >
                          <Text className="text-white font-bold">Apply Filters</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          className="bg-[#F3F4F6] px-4 py-2 rounded-lg"
                          onPress={() => setShowFilterModal(false)}
                          >
                          <Text className="text-[#4B5563] font-bold">Cancel</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>
  );
};