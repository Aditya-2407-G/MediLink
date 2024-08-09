import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider component
const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
    });

    useEffect(() => {
        const loadTokens = async () => {
            try {
                const accessToken = await SecureStore.getItemAsync(
                    process.env.EXPO_PUBLIC_ACCESS_TOKEN_SECRET
                );
                const refreshToken = await SecureStore.getItemAsync(
                    process.env.EXPO_PUBLIC_REFRESH_TOKEN_SECRET
                );
                if (accessToken && refreshToken) {
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${accessToken}`;
                    setAuthState({
                        accessToken,
                        refreshToken,
                        authenticated: true,
                    });
                } else {
                    setAuthState({
                        accessToken: null,
                        refreshToken: null,
                        authenticated: false,
                    });
                }
            } catch (error) {
                console.log(error);
                setAuthState({
                    accessToken: null,
                    refreshToken: null,
                    authenticated: false,
                });
            }
        };
        loadTokens();
    }, []);

    const register = async (user) => {
        try {
            console.log("USER BEING SENT IS: ", user);
            console.log(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`)
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
                {
                    ...user,
                }
            );
            console.log(response.data);
            Alert.alert("Success", response.data.message);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", error.response.data.message);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
                {
                    email,
                    password,
                }
            );

            if (response.status != "200") {
                Alert.alert("Error", "Invalid Credentials");
                return;
            }

            if (response.status == "200") {
                Alert.alert("Success", "Logged in successfully");
                console.log("Login response: ", response.data);
            }
            const { accessToken, refreshToken } = response.data;

            setAuthState({
                accessToken,
                refreshToken,
                authenticated: true,
            });

            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${accessToken}`;

            await SecureStore.setItemAsync(
                process.env.EXPO_PUBLIC_ACCESS_TOKEN_SECRET,
                accessToken
            );
            await SecureStore.setItemAsync(
                process.env.EXPO_PUBLIC_REFRESH_TOKEN_SECRET,
                refreshToken
            );
            console.log(accessToken, refreshToken);
            console.log(
                "hello",
                process.env.EXPO_PUBLIC_ACCESS_TOKEN_SECRET,
                process.env.EXPO_PUBLIC_REFRESH_TOKEN_SECRET
            );

            return response;
        } catch (error) {
            Alert.alert("Error", error.response.data.message);
            console.log(error);
        }
    };

    const refreshAccessToken = async () => {
        try {
            const refreshToken = await SecureStore.getItemAsync(
                process.env.EXPO_PUBLIC_REFRESH_TOKEN_SECRET
            );
            if (!refreshToken) throw new Error("No refresh token available");

            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
                {
                    refreshToken,
                }
            );

            const { accessToken, refreshToken: newRefreshToken } =
                response.data;

            setAuthState((prevState) => ({
                ...prevState,
                accessToken,
                refreshToken: newRefreshToken || prevState.refreshToken,
            }));

            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${accessToken}`;

            await SecureStore.setItemAsync(
                process.env.EXPO_PUBLIC_ACCESS_TOKEN_SECRET,
                accessToken
            );
            if (newRefreshToken) {
                await SecureStore.setItemAsync(
                    process.env.EXPO_PUBLIC_REFRESH_TOKEN_SECRET,
                    newRefreshToken
                );
            }
        } catch (error) {
            console.log("Error refreshing token:", error);
            logout(); // Optionally log the user out if refreshing fails
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(process.env.EXPO_PUBLIC_ACCESS_TOKEN_SECRET);
        await SecureStore.deleteItemAsync(process.env.EXPO_PUBLIC_REFRESH_TOKEN_SECRET);
        axios.defaults.headers.common["Authorization"] = "";
        setAuthState({
            accessToken: null,
            refreshToken: null,
            authenticated: false,
        });
    };

    const value = {
        register,
        login,
        logout,
        refreshAccessToken,
        authState,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
