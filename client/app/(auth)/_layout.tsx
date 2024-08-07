import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
    return (
        <>
            <StatusBar backgroundColor="#161622" style="light" />

            <Stack>
                <Stack.Screen
                    name="SignIn"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="SignUp"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </>
    );
};

export default AuthLayout;
