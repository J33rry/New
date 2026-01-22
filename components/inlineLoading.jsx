import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

// Lightweight inline loader for small fetches (e.g., daily problem, sections)
const InlineLoading = ({ message = "Loading..." }) => {
    return (
        <View className="flex-row items-center gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <ActivityIndicator size="small" color="#22d3ee" />
            <View className="flex-1">
                <Text className="text-light-text_main dark:text-dark-text_main font-semibold">
                    {message}
                </Text>
                <Text className="text-xs text-slate-400 mt-1">
                    This should only take a moment.
                </Text>
            </View>
        </View>
    );
};

export default InlineLoading;
