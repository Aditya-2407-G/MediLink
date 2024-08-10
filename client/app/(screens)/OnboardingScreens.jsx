import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const OnboardingScreens = () => {
    const onboardingPages = [
        {
            backgroundColor: "#eff6ff",

            image: <></>,
            title: (
                <Text className="font-poppins-bold text-6xl text-blue-600 pt-10 text-start w-full">
                    MediLink
                </Text>
            ),
            subtitle: (
                <Text className="font-poppins-medium text-xl text-gray-500 mt-4 text-start">
                    Find doctors around you and enjoy a seamless appointment
                    booking experience.
                </Text>
            ),
        },
        {
            backgroundColor: "#eff6ff",
            image: <></>,
            title: (
                <Text className="font-poppins-bold text-5xl text-blue-600 pt-10 whitespace-bre text-start w-full">
                    Book an appointment
                </Text>
            ),
            subtitle: (
                <Text className="font-poppins-medium text-xl text-gray-500 mt-4 text-start w-full">
                    Find your ideal doctor by searching, applying filters, and
                    exploring profiles. Once you've made your choice, easily
                    book an appointment right from the doctor's profile.
                </Text>
            ),
        },
        {
            backgroundColor: "#eff6ff",
            image: <></>,
            title: (
                <Text className="font-poppins-bold text-5xl text-blue-600 pt-10 w-full whitespace-pre-wrap">
                    Never miss an appointment
                </Text>
            ),
            subtitle: (
                <Text className="font-poppins-medium text-xl text-gray-500 mt-5 text-start">
                    View all your appointments in the appointment
                    section. Each appointment card features a map link for easy
                    navigation to the doctor, and you can also cancel any
                    appointment if needed.
                </Text>
            ),
        },
    ];

    const handleDone = async () => {
        await SecureStore.setItemAsync("onboardingShown", "true");
        router.replace("/SignIn");
    };
    const doneButton = ({ ...props }) => (
        <TouchableOpacity>
            <Text
                className="font-poppins-regular"
                style={{ fontSize: 16, color: "#333", padding: 20 }}
                {...props}
            >
                Done
            </Text>
        </TouchableOpacity>
    );

    return (
        <Onboarding
            onSkip={handleDone}
            onDone={handleDone}
            bottombarHighlight={false}
            pages={onboardingPages}
            containerStyles={styles.container}
            imageContainerStyles={styles.imageContainer}
            titleStyles={styles.title}
            subtitleStyles={styles.subtitle}
            DoneButtonComponent={doneButton}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#eff6ff",
        flex: 1,
        paddingHorizontal: 20,
    },
    imageContainer: {
        display: "none",
        height: 200,
        marginBottom: 10,
    },
    image: {
        display: "none",
        height: "80%",
        aspectRatio: 1,
        resizeMode: "contain",
        padding: 6,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
        textAlign: "start",
    },
    subtitle: {
        fontSize: 16,
        color: "#333",
    },
});

export default OnboardingScreens;
