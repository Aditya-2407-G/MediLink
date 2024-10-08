import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TextInput,
    Image,
    TouchableOpacity,
    Alert,
    BackHandler,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import CustomButton from "@/components/CustomButton";
import * as Yup from "yup";
import { Link, router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import * as Location from "expo-location";
import { openSettings } from "expo-linking";

const formSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
});

interface Values {
    email: string;
    password: string;
}

const SignIn = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);  // Add loading state
    const [location, setLocation] = useState(null);

    const { login } = useAuth();

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    useEffect(() => {
        const GetLocationPermission = async () => {
            try {
                const { status } = await Location.getForegroundPermissionsAsync();
                if (status !== "granted") {
                    const { status } = await Location.requestForegroundPermissionsAsync();
                    if (status !== "granted") {
                        Alert.alert(
                            "Location Permission Required",
                            "Location access is necessary to find doctors near you. Please go to the app settings and allow location permission.",
                            [
                                {
                                    text: "OK",
                                    onPress: () => BackHandler.exitApp(),
                                },
                                {
                                    text: "Open Settings",
                                    onPress: () => openSettings(),
                                },
                            ]
                        );
                    }
                }
            } catch (error) {
                console.error("Error getting location:", error);
            }
        };
        GetLocationPermission();
    }, []);

    const handleSignIn = async (values: Values) => {
        try {
            setLoading(true);  // Start loading
            const res = await login(values.email, values.password);

            if (res.status === 200) {
                router.replace("/Home");
            }
        } catch (error) {
            console.log("Error signing in", error);
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-blue-50">
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                }}
                className="px-5"
            >
                <View className="bg-white rounded-3xl p-6 px-5 shadow-lg">
                    <Text className="text-blue-700 text-4xl mb-2 text-center font-poppins-bold">
                        Sign In
                    </Text>
                    <Text className="text-blue-600 text-xl mb-8 text-center font-poppins-regular">
                        Access best of healthcare
                    </Text>
                    <Formik
                        initialValues={{
                            email: "",
                            password: "",
                        }}
                        validationSchema={formSchema}
                        onSubmit={(values: Values) => {
                            handleSignIn(values);
                        }}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                        }) => (
                            <View className="space-y-5">
                                <View className="flex flex-col">
                                    <Text className="text-blue-700 font-poppins-semibold mb-2 text-lg">
                                        Email
                                    </Text>
                                    <TextInput
                                        className="border border-blue-300 rounded-lg p-4 bg-blue-50 text-lg font-poppins-regular"
                                        placeholder="ramkumar@gmail.com"
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        value={values.email}
                                    />
                                    {touched.email && errors.email && (
                                        <Text className="text-red-500 mt-1 font-poppins-regular">
                                            {errors.email}
                                        </Text>
                                    )}
                                </View>

                                <View className="flex flex-col">
                                    <Text className="text-blue-700 font-poppins-semibold mb-2 text-lg">
                                        Password
                                    </Text>
                                    <View className="relative flex-row items-center">
                                        <TextInput
                                            className="flex-1 border border-blue-300 rounded-lg p-4 bg-blue-50 text-lg pr-12 font-poppins-regular"
                                            secureTextEntry={!isPasswordVisible}
                                            placeholder="••••••••"
                                            onChangeText={handleChange("password")}
                                            onBlur={handleBlur("password")}
                                            value={values.password}
                                        />
                                        <TouchableOpacity
                                            onPress={togglePasswordVisibility}
                                            className="absolute right-4"
                                        >
                                            <Image
                                                source={
                                                    isPasswordVisible
                                                        ? require("@/assets/icons/eye-hide.png")
                                                        : require("@/assets/icons/eye.png")
                                                }
                                                style={{
                                                    width: 24,
                                                    height: 24,
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {touched.password && errors.password && (
                                        <Text className="text-red-500 mt-1 font-poppins-regular">
                                            {errors.password}
                                        </Text>
                                    )}
                                </View>

                                <CustomButton
                                    title="Sign In"
                                    handlePress={handleSubmit}
                                    containerStyles="w-full bg-blue-700 p-4 rounded-lg mt-6"
                                    textStyles="text-white text-center font-bold text-xl font-poppins-semibold"
                                    isLoading={loading}  // Pass loading state to CustomButton
                                />

                                <View className="flex justify-center flex-row gap-2 mt-6">
                                    <Text className="text-lg text-gray-700 font-poppins-regular">
                                        Don't have an account?
                                    </Text>
                                    <Link
                                        href="/SignUp"
                                        className="text-lg font-semibold text-blue-600 font-poppins-semibold"
                                    >
                                        Sign Up
                                    </Link>
                                </View>
                            </View>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
