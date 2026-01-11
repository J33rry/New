import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Linking,
    Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { contestAPI } from "../../services/api";
import { SafeAreaView } from "react-native-safe-area-context";

const Upcoming = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContests = async () => {
            setLoading(true);
            try {
                const response = await contestAPI.upcomingContests();
                // 1. FIX: Access the nested 'data' array
                // API Structure: { status: "success", data: [...] }
                setContests(response.data.data || []);
            } catch (error) {
                console.error("Error fetching contests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContests();
    }, []);

    // Helper to format Unix timestamp
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Helper to format duration (seconds -> hours/mins)
    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return `${hrs}h ${mins > 0 ? mins + "m" : ""}`;
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50 p-4">
            <Text className="text-2xl font-bold mb-4 text-gray-800">
                Upcoming Contests
            </Text>

            <FlatList
                data={contests}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    // 2. FIX: Added parenthesis () for implicit return
                    <View
                        // onPress={() => Linking.openURL(item.url)}
                        className="bg-white p-4 mb-3 rounded-xl border border-gray-200 shadow-sm"
                    >
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-1 mr-2">
                                <Text className="text-lg font-bold text-gray-800 leading-6">
                                    {item.title}
                                </Text>
                            </View>

                            {/* Platform Badge */}
                            <View
                                className={`px-2 py-1 rounded-md ${
                                    item.platform === "LeetCode"
                                        ? "bg-yellow-100"
                                        : "bg-blue-100"
                                }`}
                            >
                                <Text
                                    className={`text-xs font-bold ${
                                        item.platform === "LeetCode"
                                            ? "text-yellow-700"
                                            : "text-blue-700"
                                    }`}
                                >
                                    {item.platform}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row mt-2">
                            {/* Start Time */}
                            <View className="bg-gray-100 px-3 py-1.5 rounded-lg mr-2">
                                <Text className="text-xs text-gray-600">
                                    📅 {formatDate(item.startTime)}
                                </Text>
                            </View>

                            {/* Duration */}
                            <View className="bg-gray-100 px-3 py-1.5 rounded-lg">
                                <Text className="text-xs text-gray-600">
                                    ⏳ {formatDuration(item.duration)}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default Upcoming;
