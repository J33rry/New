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
import LoadingScreen from "../../components/loadingScreen";

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
        return <LoadingScreen message="Fetching Upcoming Contests..." />;
    }

    return (
        <SafeAreaView className="flex-1 bg-light-primary dark:bg-dark-primary p-4">
            <Text className="text-2xl font-bold text-light-text_main dark:text-dark-text_main mb-4">
                Upcoming contest
            </Text>

            <FlatList
                data={contests}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    // 2. FIX: Added parenthesis () for implicit return
                    <View className="px-4 py-2 border rounded-lg bg-light-surface dark:bg-dark-surface mb-4">
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-1 mr-2">
                                <Text className="text-lg font-bold text-light-text_main dark:text-dark-text_main leading-6">
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
