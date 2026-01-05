import React from "react";
import { Tabs, Redirect, Slot } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "../../context/AuthContext.jsx"; // adjust path if needed
import { ProblemProvider } from "../../context/problemContext.jsx";

const ProtectedTabs = () => {
    const { user, initializing } = useAuth();

    if (initializing) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveBackgroundColor: "#6200ee",
                tabBarActiveTintColor: "#ffffff",
            }}
        >
            <Tabs.Screen name="home" options={{ title: "Home" }} />
            <Tabs.Screen name="contest" options={{ title: "Contest" }} />
            <Tabs.Screen name="problems" options={{ title: "Problems" }} />
            <Tabs.Screen name="stats" options={{ title: "Stats" }} />
            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
    );
};

export default function Layout() {
    return (
        <ProblemProvider>
            <ProtectedTabs />
        </ProblemProvider>
    );
}
