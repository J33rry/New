import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "../../context/AuthContext.jsx"; // update relative path as needed
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
    const { user, initializing } = useAuth();

    if (initializing) return <Text>Loading...</Text>;
    // console.log(user);
    return (
        <SafeAreaView className="flex-1 justify-center items-center gap-4">
            <Text>{user ? `Welcome, ${user.email}` : "Not signed in"}</Text>
        </SafeAreaView>
    );
};

export default Home;
