import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { codeforcesAPI } from "../../services/api"; // Adjust path
import CodeforcesDescription from "../../components/codeforcesDescription"; // New Component
import LoadingScreen from "../../components/loadingScreen";

const CodeForcesProblem = () => {
    // 1. Handle params. This supports both /codeforces/1234-A and /codeforces/1234/A
    const params = useLocalSearchParams();

    // Logic to extract contestId and index
    let contestId = null;
    let index = null;

    if (params.id) {
        const parts = params.id.split("-");
        contestId = Number(parts[0]);
        index = parts[1];
    }

    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!contestId || !index) return;

            try {
                setLoading(true);
                const response = await codeforcesAPI.getProblemDetails({
                    contestId,
                    index,
                });
                setDetails(response.data);
            } catch (error) {
                console.error("Failed to fetch problem details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [contestId, index]);

    if (loading) {
        return <LoadingScreen message="Loading Problem" />;
    }

    if (!details || !details.data) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <Text className="text-gray-500">Problem not found</Text>
            </SafeAreaView>
        );
    }

    const problem = details.data;

    return (
        <SafeAreaView className="flex-1 bg-light-primary dark:bg-dark-primary">
            <View className="flex-1 px-4 pt-2">
                {/* Header Section */}
                <View className="mb-4 border-b border-light-border_color dark:border-dark-border_color pb-2">
                    <Text className="text-xl font-bold text-light-text_main dark:text-dark-text_main mb-2">
                        {problem.title}
                    </Text>

                    <View className="flex-row flex-wrap gap-2">
                        {/* Time Limit Badge */}
                        <View className="bg-blue-100 px-2 py-1 rounded">
                            <Text className="text-xs text-blue-800 font-medium">
                                ⏱ {problem.timeLimit || "N/A"}
                            </Text>
                        </View>

                        {/* Memory Limit Badge */}
                        <View className="bg-purple-100 px-2 py-1 rounded">
                            <Text className="text-xs text-purple-800 font-medium">
                                💾 {problem.memoryLimit || "N/A"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* The WebView Renderer */}
                <CodeforcesDescription htmlContent={problem.html} />
            </View>
        </SafeAreaView>
    );
};

export default CodeForcesProblem;
