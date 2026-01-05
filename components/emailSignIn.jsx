import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "expo-router";

const EmailSignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { loginWithEmail } = useAuth();

    const handleSubmit = () => {
        if (!email || !password) return;
        loginWithEmail(email, password);
    };

    return (
        <View className="flex-col w-48">
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                className="text-center"
                placeholderTextColor="#000"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#000"
                className="text-center"
            />
            <Pressable
                onPress={handleSubmit}
                className="flex-row items-center justify-center bg-white border border-gray-300 rounded-lg py-3 px-4 shadow-sm active:bg-gray-100 w-48"
                style={{ elevation: 2 }}
            >
                <Text>Log-in</Text>
            </Pressable>

            <Link href="/(auth)/register" className="m-4">
                Go to Register
            </Link>
        </View>
    );
};

export default EmailSignIn;
