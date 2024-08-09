import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const ScreenLayout = () => {
    return (
        <>
            <StatusBar backgroundColor="#161622" style="light" />

            <Stack>
                <Stack.Screen
                    name="FindDoctor"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="DoctorInfo"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Notification"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </>
    );
};

export default ScreenLayout;
