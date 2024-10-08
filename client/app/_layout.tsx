import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import AuthProvider from "../context/AuthContext.js";


export default function RootLayout() {
  // import fonts as requirement
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

    useEffect(() => {
        if (error) throw error;

        // ensure fonts are loaded before displaying 
        if (fontLoaded) {
          SplashScreen.hideAsync();
        }
      }, [fontLoaded, error]);
    
      if (!fontLoaded) {
        return null;
      }
    
      if (!fontLoaded && !error) {
        return null;
      }

    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(screens)" options={{ headerShown: false }} />
            </Stack>
        </AuthProvider>
    );
}
