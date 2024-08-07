import { ScrollView, TextInput, View, Text, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import CustomButton from "../components/CustomButton";
import { Redirect, router } from "expo-router";
import { useAuth } from "@/context/AuthContext";


export default function Index() {

    const {authState} = useAuth();

    if(authState?.authenticated) {
        return <Redirect href="/Home" />
    }




    return (
        <SafeAreaView className="flex bg-primary">
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                {/* @ts-ignore */}
                <StatusBar backgroundColor="#161622" style ="light" />


                <View>
                    <Text className="text-white font-extrabold text-center text-3xl p-10">
                        Welcome to MediLink !
                    </Text>
                </View>

                <View className="flex items-center flex-row px-12 justify-between">
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
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
