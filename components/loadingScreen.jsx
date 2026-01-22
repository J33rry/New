import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const LoadingScreen = ({
    title = "Cozer",
    message = "Preparing your dashboard...",
}) => {
    return (
        <SafeAreaView className="flex-1 bg-[#0B1222]">
            <LinearGradient
                colors={["#0B1222", "#0F172A", "#111827"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-1"
            >
                <View className="flex-1 items-center justify-center px-6">
                    <View className="w-16 h-16 rounded-3xl bg-white/5 border border-cyan-400/20 items-center justify-center mb-6">
                        <ActivityIndicator size="large" color="#22d3ee" />
                    </View>
                    <Text className="text-2xl font-semibold text-white tracking-wide">
                        {title}
                    </Text>
                    <Text className="text-slate-300 mt-2 text-center">
                        {message}
                    </Text>
                    <Text className="text-xs text-slate-500 mt-6">
                        Syncing with LeetCode · Codeforces · Firebase
                    </Text>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default LoadingScreen;
