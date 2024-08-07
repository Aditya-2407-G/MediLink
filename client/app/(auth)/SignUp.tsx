import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TextInput,
    Alert,
} from "react-native";
import React from "react";
import { Formik } from "formik";
import CustomButton from "@/components/CustomButton";
import * as Yup from "yup";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const formSchema = Yup.object().shape({
    name: Yup.string().required("name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
});

interface Values {
    email: string;
    name: string;
    password: string;
}

const SignUp = () => {
    const { register }: any = useAuth();

    const handleSignUp = async (values: Values) => {
        try {
            await register(values.name, values.email, values.password);
        } catch (error) {
            console.log("Error signing up", error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-green-50">
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                }}
                className="px-5"
            >
                <View className="bg-white rounded-3xl p-6 px-5 shadow-lg">
                    <Text className="text-green-800 text-4xl mb-2 text-center font-extrabold">
                        Sign Up
                    </Text>
                    <Text className="text-green-600 text-xl mb-8 text-center">
                        Your Access to Top Doctors
                    </Text>
                    <Formik
                        initialValues={{
                            email: "",
                            name: "",
                            password: "",
                        }}
                        validationSchema={formSchema}
                        onSubmit={(values: Values) => {
                            handleSignUp(values);
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
                                    <Text className="text-green-700 font-semibold mb-2 text-lg">
                                        Name
                                    </Text>
                                    <TextInput
                                        className="border border-green-300 rounded-lg p-4 bg-green-50 text-lg"
                                        placeholder="john"
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

                                <View className="flex flex-col">
                                    <Text className="text-green-700 font-semibold mb-2 text-lg">
                                        Email
                                    </Text>
                                    <TextInput
                                        className="border border-green-300 rounded-lg p-4 bg-green-50 text-lg"
                                        placeholder="johndoe@gmail.com"
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        value={values.email}
                                    />
                                    {touched.email && errors.email && (
                                        <Text className="text-red-500 mt-1">
                                            {errors.email}
                                        </Text>
                                    )}
                                </View>

                                <View className="flex flex-col">
                                    <Text className="text-green-700 font-semibold mb-2 text-lg">
                                        Password
                                    </Text>
                                    <TextInput
                                        className="border border-green-300 rounded-lg p-4 bg-green-50 text-lg"
                                        secureTextEntry
                                        placeholder="johncodes"
                                        onChangeText={handleChange("password")}
                                        onBlur={handleBlur("password")}
                                        value={values.password}
                                    />
                                    {touched.password && errors.password && (
                                        <Text className="text-red-500 mt-1">
                                            {errors.password}
                                        </Text>
                                    )}
                                </View>

                                <CustomButton
                                    title="Sign Up"
                                    handlePress={handleSubmit}
                                    containerStyles="w-full bg-green-600 p-4 rounded-lg mt-6"
                                    textStyles="text-white text-center font-bold text-xl"
                                    isLoading={undefined}
                                />
                                <View className="flex justify-center flex-row gap-2">
                                    <Text className="text-lg text-gray-700 font-pregular">
                                        Already have an account?
                                    </Text>
                                    <Link
                                        href="/SignIn"
                                        className="text-lg font-semibold text-green-600"
                                    >
                                        Sign In
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

export default SignUp;
