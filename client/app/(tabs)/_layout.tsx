import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TabLayout = () => {

    return (
        <>
            <StatusBar backgroundColor="#161622" style="light" />
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#3A83F4",
                    tabBarInactiveTintColor: "#CDCDE0",
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: "#1E1E2C",
                        borderTopWidth: -1,
                        height: 70,
                        borderRadius: 100,
                        position: "absolute",
                        bottom: 20, // Adjust this value to move the tab bar up
                        left: 10, // Add padding from left
                        right: 10, // Add padding from right
                    },
                }}
            >
                <Tabs.Screen
                    name="Home"
                    options={{
                        title: "Home",
                        headerShown: false,
                    }}
                />

            </Tabs>
        </>
    );
};

export default TabLayout;
