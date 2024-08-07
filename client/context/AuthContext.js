import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
export const API_URL = "http://192.168.0.174:8000";

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
            const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
            const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
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
        };
        loadTokens();
    }, []);

    const register = async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name,
                email,
                password,
            });
            console.log(response.data);
            Alert.alert("Success", response.data.message);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", error.response.data.message);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });

            const { accessToken, refreshToken } = response.data;

            setAuthState({
                accessToken,
                refreshToken,
                authenticated: true,
            });

            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${accessToken}`;

            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);

            Alert.alert("Success", "Logged in successfully");
            console.log(accessToken, refreshToken);
            
            return response;
        } catch (error) {
            Alert.alert("Error", error.response.data.message);
            console.log(error);
        }
    };

    const refreshAccessToken = async () => {
        try {
            const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
            if (!refreshToken) throw new Error("No refresh token available");

            const response = await axios.post(`${API_URL}/auth/refresh`, {
                refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            setAuthState((prevState) => ({
                ...prevState,
                accessToken,
                refreshToken: newRefreshToken || prevState.refreshToken,
            }));

            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${accessToken}`;

            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
            if (newRefreshToken) {
                await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
            }
        } catch (error) {
            console.log("Error refreshing token:", error);
            logout();  // Optionally log the user out if refreshing fails
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
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
