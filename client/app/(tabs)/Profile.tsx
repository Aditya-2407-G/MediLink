import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const Profile = () => {
  const { authState, logout } = useAuth();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch user details if not already available in authState
        const token = authState.accessToken;
        if (token) {
          const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/user/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserDetails(response.data);
        }
      } catch (error) {
        console.log("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [authState.accessToken]);

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Success", "You have been logged out.");
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  if (!userDetails) {
    return (
      <SafeAreaView>
        <Text className='text-center text-2xl'>Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Text className='text-center text-2xl'>Profile</Text>
      <View className='p-4'>
        <Text>Name: {userDetails.name}</Text>
        <Text>Email: {userDetails.email}</Text>
        <Text>Role: {userDetails.role}</Text>
        {userDetails.doctorDetails && (
          <>
            <Text>Specialization: {userDetails.doctorDetails.specialization}</Text>
            <Text>Hospital: {userDetails.doctorDetails.hospitalName}</Text>
            <Text>Experience: {userDetails.doctorDetails.experience} years</Text>
          </>
        )}
      </View>
      <Button title="Logout" onPress={handleLogout} />
    </SafeAreaView>
  );
};

export default Profile;
