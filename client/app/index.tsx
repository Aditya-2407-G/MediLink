import { ScrollView, TextInput, View, Text, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import CustomButton from "../components/CustomButton";
import { Redirect, router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
    // const { authState } = useAuth();

    // if (authState?.authenticated) {
    //     return <Redirect href="/Home" />;
    // }

    return (
        <SafeAreaView className="flex-1  ">
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                {/* @ts-ignore */}
                <StatusBar backgroundColor="#161622" style="light" />

                <View>
                    <Text className="text-white font-poppins-regular text-center text-3xl p-10">
                        Welcome to MediLink !
                    </Text>
                </View>

                <View className="flex items-center flex-col m-10">
                    <CustomButton
                        title="Sign In"
                        handlePress={() => router.push("/SignIn")}
                        containerStyles="bg-green-600 w-1/3"
                        textStyles="text-xl text-white"
                        isLoading={undefined}
                    />
                    <CustomButton
                        title="Sign Up"
                        handlePress={() => router.push("/SignUp")}
                        containerStyles="bg-green-600 w-1/3"
                        textStyles="text-xl text-white"
                        isLoading={undefined}
                    />
                    <CustomButton
                        title="Home"
                        handlePress={() => router.push("/Home")}
                        containerStyles="bg-green-600 w-1/3"
                        textStyles="text-xl text-white"
                        isLoading={undefined}
                    />
                    <CustomButton
                        title="Notifications"
                        handlePress={() => router.push("/Notification")}
                        containerStyles="bg-green-600 w-1/3"
                        textStyles="text-xl text-white"
                        isLoading={undefined}
                    />

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
