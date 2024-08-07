import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TextInput,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import React, {useState} from "react";
import { Formik } from "formik";
import CustomButton from "@/components/CustomButton";
import * as Yup from "yup";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const formSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    role: Yup.string().oneOf(["user", "doctor"]).required("Role is required"),
    hospitalName: Yup.string().test(
        "required-if-doctor",
        "Hospital name is required",
        function (value) {
            const { role } = this.parent;
            return role !== "doctor" || (value && value.trim().length > 0);
        }
    ),
    hospitalAddress: Yup.string().test(
        "required-if-doctor",
        "Hospital address is required",
        function (value) {
            const { role } = this.parent;
            return role !== "doctor" || (value && value.trim().length > 0);
        }
    ),
    specialization: Yup.string().test(
        "required-if-doctor",
        "Specialization is required",
        function (value) {
            const { role } = this.parent;
            return role !== "doctor" || (value && value.trim().length > 0);
        }
    ),
    fees: Yup.number().test(
        "required-if-doctor",
        "Fees are required",
        function (value) {
            const { role } = this.parent;
            return role !== "doctor" || (value !== undefined && value >= 0);
        }
    ),
    city: Yup.string().test(
        "required-if-doctor",
        "City is required",
        function (value) {
            const { role } = this.parent;
            return role !== "doctor" || (value && value.trim().length > 0);
        }
    ),
    state: Yup.string().test(
        "required-if-doctor",
        "State is required",
        function (value) {
            const { role } = this.parent;
            return role !== "doctor" || (value && value.trim().length > 0);
        }
    ),
    country: Yup.string().test(
        "required-if-doctor",
        "Country is required",
        function (value) {
            const { role } = this.parent;
            return role !== "doctor" || (value && value.trim().length > 0);
        }
    ),
});

interface Values {
    email: string;
    name: string;
    password: string;
    role: "user" | "doctor";
    hospitalName?: string;
    hospitalAddress?: string;
    specialization?: string;
    fees?: string;
    city?: string;
    state?: string;
    country?: string;
}

const SignUp = () => {
    const [loading, setLoading] = useState(false);
    const { register }: any = useAuth();
    
    const handleSignUp = async (values: Values) => {
        console.log("handleSignUp function called with values:", values);
        setLoading(true);
        try {
            let userDetails: any = {
                name: values.name,
                email: values.email,
                password: values.password,
                role: values.role,
                hospitalName: values.hospitalName,
                hospitalAddress: values.hospitalAddress,
                specialization: values.specialization,
                fees: values.fees,
                city: values.city,
                state: values.state,
                country: values.country,
            };
    
            // if (values.role === "doctor") {
            //     userDetails = {
            //         ...userDetails,
            //         hospitalName: values.hospitalName,
            //         hospitalAddress: values.hospitalAddress,
            //         specialization: values.specialization,
            //         fees: values.fees,
            //         city: values.city,
            //         state: values.state,
            //         country: values.country,
            //     };
            // }
    
            console.log("Registering user with details:", userDetails);
            await register(userDetails);
            console.log("Registration successful");
            Alert.alert("Sign Up Successful", "Your account has been created successfully.");
        } catch (error) {
            console.error("Error signing up:", error);
            Alert.alert(
                "Sign Up Error",
                "An error occurred while signing up. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <SafeAreaView className="flex-1 bg-blue-50">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        flexShrink: 0,
                        justifyContent: "center",
                        paddingTop: 70,
                        paddingBottom: 20,
                    }}
                    className="px-5"
                >
                    <View className="bg-white rounded-3xl p-6 px-5 shadow-lg">
                        <View className="items-center">
                            <Text className="text-blue-700 text-4xl mb-2 text-center font-extrabold">
                                Create Account
                            </Text>
                            <Text className="text-blue-600 text-xl mb-8 text-center">
                                Join our community of health professionals and
                                patients
                            </Text>
                        </View>

                        <Formik
                            initialValues={{
                                email: "",
                                name: "",
                                password: "",
                                role: "user",
                                hospitalName: "",
                                hospitalAddress: "",
                                specialization: "",
                                fees: "",
                                city: "",
                                state: "",
                                country: "",
                            }}
                            validationSchema={formSchema}
                            onSubmit={(values:Values) => {handleSignUp(values)}}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                setFieldValue,
                                values,
                                errors,
                                touched,
                            }) => (
                                <View className="space-y-5">
                                    <View className="flex flex-col">
                                        <Text className="text-blue-700 font-semibold mb-2 text-lg">
                                            Name
                                        </Text>
                                        <TextInput
                                            className="border border-blue-300 rounded-lg p-4 bg-blue-50 text-lg"
                                            placeholder="John Doe"
                                            onChangeText={handleChange("name")}
                                            onBlur={handleBlur("name")}
                                            value={values.name}
                                        />
                                        {touched.name && errors.name && (
                                            <Text className="text-red-500 mt-1">
                                                {errors.name}
                                            </Text>
                                        )}
                                    </View>
                                    <View>
                                        <Text className="text-blue-700 font-semibold mb-2 text-lg">
                                            Email
                                        </Text>
                                        <TextInput
                                            className="border border-blue-300 rounded-lg p-4 bg-blue-50 text-lg"
                                            placeholder="johndoe@example.com"
                                            onChangeText={handleChange("email")}
                                            onBlur={handleBlur("email")}
                                            value={values.email}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                        {touched.email && errors.email && (
                                            <Text className="text-red-500 mt-1">
                                                {errors.email}
                                            </Text>
                                        )}
                                    </View>
                                    <View>
                                        <Text className="text-blue-700 font-semibold mb-2 text-lg">
                                            Password
                                        </Text>
                                        <TextInput
                                            className="border border-blue-300 rounded-lg p-4 bg-blue-50 text-lg"
                                            secureTextEntry
                                            placeholder="••••••••"
                                            onChangeText={handleChange(
                                                "password"
                                            )}
                                            onBlur={handleBlur("password")}
                                            value={values.password}
                                        />
                                        {touched.password &&
                                            errors.password && (
                                                <Text className="text-red-500 mt-1">
                                                    {errors.password}
                                                </Text>
                                            )}
                                    </View>
                                    <View>
                                        <Text className="text-blue-700 font-semibold mb-2 text-lg">
                                            I am a
                                        </Text>
                                        <View className="flex-row space-x-4">
                                            <TouchableOpacity
                                                onPress={() =>
                                                    setFieldValue(
                                                        "role",
                                                        "user"
                                                    )
                                                }
                                                className={`flex-1 p-4 rounded-xl border ${
                                                    values.role === "user"
                                                        ? "bg-blue-100 border-blue-500"
                                                        : "border-gray-300"
                                                }`}
                                            >
                                                <Ionicons
                                                    name="person"
                                                    size={24}
                                                    color={
                                                        values.role === "user"
                                                            ? "#1d4ed8"
                                                            : "#6b7280"
                                                    }
                                                    style={{
                                                        alignSelf: "center",
                                                    }}
                                                />
                                                <Text
                                                    className={`text-center mt-2 ${
                                                        values.role === "user"
                                                            ? "text-blue-700 font-semibold"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    Patient
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    setFieldValue(
                                                        "role",
                                                        "doctor"
                                                    )
                                                }
                                                className={`flex-1 p-4 rounded-xl border ${
                                                    values.role === "doctor"
                                                        ? "bg-blue-100 border-blue-500"
                                                        : "border-gray-300"
                                                }`}
                                            >
                                                <Ionicons
                                                    name="medical"
                                                    size={24}
                                                    color={
                                                        values.role === "doctor"
                                                            ? "#1d4ed8"
                                                            : "#6b7280"
                                                    }
                                                    style={{
                                                        alignSelf: "center",
                                                    }}
                                                />
                                                <Text
                                                    className={`text-center mt-2 ${
                                                        values.role === "doctor"
                                                            ? "text-blue-700 font-semibold"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    Doctor
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {values.role === "doctor" && (
                                        <View className="mt-5 space-y-5">
                                            <View className="flex flex-col">
                                                <Text className="text-blue-700 font-semibold mb-2 text-lg">
                                                    Hospital Name
                                                </Text>
                                                <TextInput
                                                    className="border border-blue-300 rounded-lg p-4 bg-blue-50 text-lg"
                                                    placeholder="ABC Hospital"
                                                    onChangeText={handleChange(
                                                        "hospitalName"
                                                    )}
                                                    onBlur={handleBlur(
                                                        "hospitalName"
                                                    )}
                                                    value={values.hospitalName}
                                                />
                                                {touched.hospitalName &&
                                                    errors.hospitalName && (
                                                        <Text className="text-red-500 mt-1">
                                                            {
                                                                errors.hospitalName
                                                            }
                                                        </Text>
                                                    )}
                                            </View>
                                            <View className="flex flex-col">
                                                <Text className="text-blue-700 font-semibold mb-2 text-lg">
                                                    Hospital Address
                                                </Text>
                                                <TextInput
                                                    className="border border-blue-300 rounded-lg p-4 bg-blue-50 text-lg"
                                                    placeholder="123 Street, City"
                                                    onChangeText={handleChange(
                                                        "hospitalAddress"
                                                    )}
                                                    onBlur={handleBlur(
                                                        "hospitalAddress"
                                                    )}
                                                    value={
                                                        values.hospitalAddress
                                                    }
                                                />
                                                {touched.hospitalAddress &&
                                                    errors.hospitalAddress && (
                                                        <Text className="text-red-500 mt-1">
                                                            {
                                                                errors.hospitalAddress
                                                            }
                                                        </Text>
                                                    )}
                                            </View>
                                            <View className="flex flex-col">
                                                <Text className="text-blue-700 font-semibold mb-2 text-lg">
                                                    Specialization
                                                </Text>
                                                <TextInput
                                                    className="border border-blue-300 rounded-lg p-4 bg-blue-50 text-lg"
                                                    placeholder="Cardiology"
                                                    onChangeText={handleChange(
                                                        "specialization"
                                                    )}
                                                    onBlur={handleBlur(
                                                        "specialization"
                                                    )}
                                                    value={
                                                        values.specialization
                                                    }
                                                />
                                                {touched.specialization &&
                                                    errors.specialization && (
                                                        <Text className="text-red-500 mt-1">
                                                            {
                                                                errors.specialization
                                                            }
                                                        </Text>
                                                    )}
                                            </View>
                                            <View className="flex flex-col">
                                                <Text className="text-blue-700 font-semibold mb-2 text-lg">
                                                    Fees
                                                </Text>
                                                <TextInput
                                                    className="border border-blue-300 rounded-lg p-4 bg-blue-50 text-lg"
                                                    placeholder="100"
                                                    keyboardType="numeric"
                                                    onChangeText={handleChange(
                                                        "fees"
                                                    )}
                                                    onBlur={handleBlur("fees")}
                                                    value={String(values.fees)}
                                                />
                                                {touched.fees &&
                                                    errors.fees && (
                                                        <Text className="text-red-500 mt-1">
                                                            {errors.fees}
                                                        </Text>
                                                    )}
                                            </View>
                                            <View className="flex flex-col">
                                                <Text className="text-blue-700 font-semibold mb-2 text-lg">
                                                    City
                                                </Text>
                                                <TextInput
                                                    className="border border-blue-300 rounded-lg p-4 bg-blue-50 text-lg"
                                                    placeholder="City"
                                                    onChangeText={handleChange(
                                                        "city"
                                                    )}
                                                    onBlur={handleBlur("city")}
                                                    value={values.city}
                                                />
                                                {touched.city &&
                                                    errors.city && (
                                                        <Text className="text-red-500 mt-1">
                                                            {errors.city}
                                                        </Text>
                                                    )}
                                            </View>
                                            <View className="flex flex-col">
                                                <Text className="text-blue-700 font-semibold mb-2 text-lg">
                                                    State
                                                </Text>
                                                <TextInput
                                                    className="border border-blue-300 rounded-lg p-4 bg-blue-50 text-lg"
                                                    placeholder="State"
                                                    onChangeText={handleChange(
                                                        "state"
                                                    )}
                                                    onBlur={handleBlur("state")}
                                                    value={values.state}
                                                />
                                                {touched.state &&
                                                    errors.state && (
                                                        <Text className="text-red-500 mt-1">
                                                            {errors.state}
                                                        </Text>
                                                    )}
                                            </View>
                                            <View className="flex flex-col">
                                                <Text className="text-blue-700 font-semibold mb-2 text-lg">
                                                    Country
                                                </Text>
                                                <TextInput
                                                    className="border border-blue-300 rounded-lg p-4 bg-blue-50 text-lg"
                                                    placeholder="Country"
                                                    onChangeText={handleChange(
                                                        "country"
                                                    )}
                                                    onBlur={handleBlur(
                                                        "country"
                                                    )}
                                                    value={values.country}
                                                />
                                                {touched.country &&
                                                    errors.country && (
                                                        <Text className="text-red-500 mt-1">
                                                            {errors.country}
                                                        </Text>
                                                    )}
                                            </View>
                                        </View>
                                    )}
                                    <CustomButton
                                        title="Sign Up"
                                        handlePress={handleSubmit}
                                        containerStyles="w-full bg-blue-600 p-4 rounded-lg mt-6"
                                        textStyles="text-white text-center font-bold text-xl"
                                        isLoading={undefined}
                                    />
                                </View>
                            )}
                        </Formik>

                        <View className="flex-row justify-center mt-8">
                            <Text className="text-lg text-gray-500">
                                Already have an account?{" "}
                            </Text>
                            <Link href="/SignIn" asChild>
                                <TouchableOpacity>
                                    <Text className="text-lg text-blue-700 font-semibold">
                                        Sign In
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUp;
