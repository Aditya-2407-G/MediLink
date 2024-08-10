import { ScrollView, Text, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
    return (
        <SafeAreaView className="flex-1 bg-[#161622]"> 
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}> 
                {/* @ts-ignore */}
                <StatusBar backgroundColor="#161622" style="light" /> 

                <View>
                    <Text className="text-white font-poppins-regular text-center text-3xl mb-10">
                        Welcome to MediLink!
                    </Text>
                </View>

                <View className="flex items-center">
                    <CustomButton
                        title="Sign In"
                        handlePress={() => router.push("/SignIn")}
                        containerStyles="bg-green-600 w-2/3 mb-4" 
                        textStyles="text-xl text-white"
                        isLoading={false}  
                    />
                    <CustomButton
                        title="Sign Up"
                        handlePress={() => router.push("/SignUp")}
                        containerStyles="bg-green-600 w-2/3 mb-4"
                        textStyles="text-xl text-white"
                        isLoading={false}
                    />
                    <CustomButton
                        title="Home"
                        handlePress={() => router.push("/Home")}
                        containerStyles="bg-green-600 w-2/3 mb-4"
                        textStyles="text-xl text-white"
                        isLoading={false}
                    />
                    <CustomButton
                        title="Notifications"
                        handlePress={() => router.push("/Notification")}
                        containerStyles="bg-green-600 w-2/3"
                        textStyles="text-xl text-white"
                        isLoading={false}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
