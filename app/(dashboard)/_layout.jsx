import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const DashBoardLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveBackgroundColor: "#6200ee",
                tabBarActiveTintColor: "#ffffff",
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIconStyle: { borderRadius: 10 },
                }}
            />
            <Tabs.Screen name="contest" options={{ title: "Contest" }} />
            <Tabs.Screen name="problems" options={{ title: "Problems" }} />
            <Tabs.Screen name="stats" options={{ title: "Stats" }} />
            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
    );
};

export default DashBoardLayout;

const styles = StyleSheet.create({});
