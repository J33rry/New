import React, { useEffect } from "react"; // <--- Import useEffect
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "../../context/AuthContext.jsx";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
    const { user, initializing } = useAuth();

    // 1. Destructure the DATA (daily) and LOADING state, not just the function

    if (initializing) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 justify-center items-center">
            <Text className="text-xl font-bold">Welcome</Text>
        </SafeAreaView>
    );
};

export default Home;
