import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Logout from "../../components/logout";

const Profile = () => {
    return (
        <SafeAreaView>
            <Text>Profile</Text>
            <Logout />
        </SafeAreaView>
    );
};

export default Profile;
