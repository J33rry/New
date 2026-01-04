import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
// import Logout from "../../components/googleSignout";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import { useAuth } from "../../context/AuthContext";

import GuestLink from "../../components/guestLink";
import UserSignOut from "../../components/signOutUser";

const Profile = () => {
    const onPress = async () => {
        await auth().signOut();
        router.push("/(auth)/login");
    };
    const { user, initializing } = useAuth();
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 justify-center items-center gap-4">
            <Text>Profile</Text>
            <GuestLink />
            <UserSignOut />
        </SafeAreaView>
    );
};

export default Profile;
