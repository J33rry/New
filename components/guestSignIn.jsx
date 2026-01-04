import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { useAuth } from "../context/AuthContext";
// import { guestSignIn } from "../context/AuthContext.jsx";

const GuestSignIn = () => {
    const { user, initializing, guestSignIn } = useAuth();
    return (
        <Pressable
            onPress={guestSignIn}
            className="flex-row items-center justify-center bg-white border border-gray-300 rounded-lg py-3 px-4 shadow-sm active:bg-gray-100 w-48"
            style={{ elevation: 2 }}
        >
            <FontAwesome name="user" size={24} color="black" className="mr-2" />
            <Text className="text-gray-700 font-bold text-base">
                Continue as Guest
            </Text>
        </Pressable>
    );
};

export default GuestSignIn;
