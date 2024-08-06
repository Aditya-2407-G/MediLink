import { ScrollView, TextInput, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { Formik } from "formik";
import React from "react";
import CustomButton from "../components/CustomButton";

const formSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
});

interface Values {
    email: string;
    username: string;
    password: string;
}

export default function Index() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="p-4">
                <Text className="text-black text-3xl font-bold">Sign Up</Text>
                <View className="flex-1 rounded-t-3xl mt-[100px] p-5">
                    <Formik
                        initialValues={{
                            email: "",
                            username: "",
                            password: "",
                        }}
                        validationSchema={formSchema}
                        onSubmit={(values: Values) => {
                            console.log("Form Submitted with values:", values);
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
                            <View className="space-y-4">
                                <View>
                                    <TextInput
                                        className="border border-gray-300 rounded-md p-3"
                                        placeholder="Username"
                                        onChangeText={handleChange("username")}
                                        onBlur={handleBlur("username")}
                                        value={values.username}
                                    />
                                    {touched.username && errors.username && (
                                        <Text className="text-red-500 mt-1">
                                            {errors.username}
                                        </Text>
                                    )}
                                </View>

                                <View>
                                    <TextInput
                                        className="border border-gray-300 rounded-md p-3"
                                        placeholder="Email"
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

                                <View>
                                    <TextInput
                                        className="border border-gray-300 rounded-md p-3"
                                        secureTextEntry
                                        placeholder="Password"
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
                                    title="Sign In"
                                    handlePress={handleSubmit}
                                    containerStyles="w-full bg-blue-500 p-3 rounded-md mt-6"
                                    textStyles="text-white text-center font-semibold"
                                    isLoading={undefined}
                                />
                            </View>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
