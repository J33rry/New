import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
// import { linkGoogleAccount } from "../context/AuthContext.jsx";

const GuestLink = () => {
    const router = useRouter();

    const { user, initializing, linkGoogleAccount } = useAuth();
    return (
        user.isAnonymous && (
            <Pressable
                onPress={linkGoogleAccount}
                className="flex-row items-center justify-center bg-white border border-gray-300 rounded-lg py-3 px-4 shadow-sm active:bg-gray-100 w-48"
                style={{ elevation: 2 }}
            >
                <Image
                    source={require("../assets/googleIcon.png")}
                    className="size-7 mr-2"
                />
                <Text className="text-gray-700 font-bold text-base">
                    Sign in with Google
                </Text>
            </Pressable>
        )
    );
};

export default GuestLink;
