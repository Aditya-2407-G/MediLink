import { Slot, SplashScreen, Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import AuthProvider from "../context/AuthContext.js";
import * as SecureStore from "expo-secure-store";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontLoaded, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    });

    const [isReady, setIsReady] = useState(false);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function checkOnboardingStatus() {
            try {
                const seenOnboarding = await SecureStore.getItemAsync('hasSeenOnboarding');
                setHasSeenOnboarding(seenOnboarding === 'true');
            } catch (e) {
                console.warn(e);
            }
        }

        async function prepare() {
            try {
                await checkOnboardingStatus();
                // Simulate some loading time
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                if (fontLoaded) {
                    await SplashScreen.hideAsync();
                }
                setIsReady(true);
            }
        }

        prepare();
    }, [fontLoaded]);

    useEffect(() => {
        if (isReady) {
            if (hasSeenOnboarding) {
                router.replace("/"); // Navigate to the main screen if onboarding is already seen
            } else {
                router.replace("/onboarding"); // Navigate to onboarding if not seen
            }
        }
    }, [isReady, hasSeenOnboarding, router]);

    if (!fontLoaded || !isReady) {
        return null; // This will keep the splash screen visible
    }

    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(screens)" options={{ headerShown: false }} />
            </Stack>
        </AuthProvider>
    );
}
