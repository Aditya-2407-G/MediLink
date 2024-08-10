import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, View, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import OnboardingScreens from "./(screens)/OnboardingScreens";
import * as SecureStore from 'expo-secure-store';

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [onboardingDone, setOnboardingDone] = useState(false);
    const { authenticated, checkAuthStatus } = useAuth();

    useEffect(() => {
        const initialize = async () => {
            await checkAuthStatus();  
            const value = await SecureStore.getItemAsync("onboardingShown");
            setOnboardingDone(value === 'true');
            setLoading(false);
        };

        initialize();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            </SafeAreaView>
        );
    }

    if (authenticated) {
        return <Redirect href="/Home" />;
    }

    if (!onboardingDone) {
        return <OnboardingScreens />;
    }

    return <Redirect href="/SignIn" />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161622",
        justifyContent: "center",
        alignItems: "center",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
