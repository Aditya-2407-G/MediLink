// import { useState, useEffect, useRef } from 'react';
// import { Text, View, Button, Platform } from 'react-native';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [expoPushToken, setExpoPushToken] = useState('');
//   const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
//   const [notification, setNotification] = useState<Notifications.Notification | undefined>(
//     undefined
//   );
//   const notificationListener = useRef<Notifications.Subscription>();
//   const responseListener = useRef<Notifications.Subscription>();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

//     if (Platform.OS === 'android') {
//       Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
//     }
//     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//       setNotification(notification);
//     });

//     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//       console.log(response);
//     });

//     return () => {
//       notificationListener.current &&
//         Notifications.removeNotificationSubscription(notificationListener.current);
//       responseListener.current &&
//         Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'space-around',
//       }}>
//       <Text>Your expo push token: {expoPushToken}</Text>
//       <Text>{`Channels: ${JSON.stringify(
//         channels.map(c => c.id),
//         null,
//         2
//       )}`}</Text>
//       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Title: {notification && notification.request.content.title} </Text>
//         <Text>Body: {notification && notification.request.content.body}</Text>
//         <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
//       </View>
//       <Button
//         title="Press to schedule a notification"
//         onPress={async () => {
//           await schedulePushNotification();
//         }}
//       />
//     </View>
//   );
// }

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: 'Here is the notification body',
//       data: { data: 'goes here', test: { test1: 'more data' } },
//     },
//     trigger: { seconds: 10 },
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     // Learn more about projectId:
//     // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
//     // EAS projectId is used here.
//     try {
//       token = (
//         await Notifications.getExpoPushTokenAsync({
//           projectId : "e4bb9f3b-6008-404a-9f27-6f51f98e7674"
//         })
//       ).data;
//       console.log(token);
//     } catch (e) {
//       token = `${e}`;
//     }
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   return token;
// }
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
    import { FilterModal } from "@/components/FilterModal";
import { DoctorCard } from "@/components/DoctorCard";
import * as Location from "expo-location";

const Notification = () => {
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
    }, []); 

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
                <Text className="text-blue-500 text-2xl mb-4 font-poppins-semibold">
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
                className="px-4"
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

export default Notification;
