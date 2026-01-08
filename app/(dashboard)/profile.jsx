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
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 justify-center items-center gap-4">
            <Text>Profile</Text>
            <Pressable
                onPress={() => router.push("/profile/completeProfile")}
                className="bg-blue-500 px-4 py-2 rounded"
            >
                <Text>Edit Profile</Text>
            </Pressable>
            <GuestLink />
            <UserSignOut />
        </SafeAreaView>
    );
};

export default Profile;
