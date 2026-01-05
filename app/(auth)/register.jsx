import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleSignIn from "../../components/googleSignIn";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState("");
    const { registerWithEmail } = useAuth();

    const handleSubmit = () => {
        if (!email || !password) return;
        registerWithEmail(email, password, user);
    };

    return (
        <SafeAreaView className="flex-1 items-center justify-center">
            <TextInput
                placeholder="User-name"
                value={user}
                onChangeText={setUser}
                autoCapitalize="none"
                // keyboardType="email-address"
                className="text-center"
                placeholderTextColor="#000"
            />
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
                <Text>Register</Text>
            </Pressable>

            <Link href="/(auth)/login" className="m-4">
                Go to Login
            </Link>

            <GoogleSignIn text="Sign in with Google" />
        </SafeAreaView>
    );
};

export default Register;
