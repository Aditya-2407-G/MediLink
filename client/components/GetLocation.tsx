import * as Location from 'expo-location';

export const GetLocation = async (setLocation, setFieldValue) => {
  try {
    // Check if location permission is granted
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission not granted');
        return;
      }
    }

    // Get the current location
    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
    setFieldValue('latitude', currentLocation.coords.latitude);
    setFieldValue('longitude', currentLocation.coords.longitude);
  } catch (error) {
    console.error('Error getting location:', error);
  }
};