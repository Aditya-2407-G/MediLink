import { View, Text, TextInput, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

const GetLocation = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission not granted');
          return;
        }
      }
      setPermissionGranted(true);
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log('Location');
      console.log(currentLocation);
    };
    getPermission();
  }, []);

  const handleGeoLocation = async () => {
    if (!permissionGranted) {
      console.log('Permission not granted');
      return;
    }
    const geoCodedAddress = await Location.geocodeAsync(address);
    console.log('address:');
    console.log(geoCodedAddress);
  };

  return (
    <SafeAreaView>
      <Text>GetLocation</Text>
      <TextInput
        placeholder="address"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Get Location" onPress={handleGeoLocation} />
    </SafeAreaView>
  );
};

export default GetLocation;