import { View, Text, Pressable } from "react-native";
import React from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useAuth } from "../context/AuthContext";
// import { signOutUser } from "../context/AuthContext.jsx";

const UserSignOut = () => {
    const { user, initializing, signOutUser } = useAuth();

    return (
        <Pressable
            onPress={signOutUser}
            className="flex-row items-center justify-center bg-red-400 border border-gray-300 rounded-lg py-3 px-4 shadow-sm active:bg-gray-100 w-48"
            style={{ elevation: 2 }}
        >
            <Text style={{ color: "white" }} className="">
                Sign Out
            </Text>
        </Pressable>
    );
};

export default UserSignOut;
