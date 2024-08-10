import React from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { router } from "expo-router";
import { images } from "../../constants";
import * as SecureStore from "expo-secure-store";
import Lottie from "lottie-react-native";

const OnboardingScreens = () => {
    const onboardingPages = [
        {
            backgroundColor: "#B2EBF2",
            image: <Image source={images.Veersa} style={styles.image} />,
            title: "Veersa Hackathon",
            subtitle: "A Seamless Doctor Booking Experience with React Native Expo",
        },
        {
            backgroundColor: "#e9bcbe",
            image: (
                <View className="self-center">
                    <Lottie
                        source={require("../../assets/animations/animation.json")}
                        autoPlay
                        style={{ height: 300, width: 300 }}
                    />
                </View>
            ),
            title: "Become the Star",
            subtitle: "Let the spotlight capture you",
        },
        {
            backgroundColor: "#FAD4B8",
            image: (
                <View className="self-center">
                    <Lottie
                        source={require("../../assets/animations/schedule.json")}
                        autoPlay
                        style={{ height: 300, width: 300 }}
                    />
                </View>
            ),
            title: "Share Your Favorites",
            subtitle: "Share your thoughts with like-minded people",
        },
    ];

    const handleDone = async () => {
        await SecureStore.setItemAsync("onboardingShown", "true");
        router.replace("/");
    };
    const doneButton = ({ ...props }) => (
        <TouchableOpacity>
            <Text
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
        flex: 1,
        paddingHorizontal: 30,
    },
    imageContainer: {
        marginBottom: 20,
    },
    image: {
        width: "100%",
        height: undefined,
        aspectRatio: 1.5,
        resizeMode: "contain",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#333",
    },
});

export default OnboardingScreens;
