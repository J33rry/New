import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

const Login = () => {
    return (
        <SafeAreaView>
            <Text>Login</Text>
            <Link href="/(dashboard)/home">Go to Home</Link>
        </SafeAreaView>
    );
};

export default Login;
