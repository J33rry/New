import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ProblemDescription from "../../components/problemDescription";
import { leetcodeAPI } from "../../services/api";

const Problems = () => {
    const [daily, setDaily] = useState(null);
    const [loading, setLoading] = useState(false);

    const getDailyProblem = async () => {
        setLoading(true);
        try {
            const response = await leetcodeAPI.dailyProblem();
            setDaily(response.data);
        } catch (error) {
            console.error("Failed to fetch daily problem", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getDailyProblem();
    }, []);
    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }
    {
        return (
            <SafeAreaView className="flex-1 bg-light-primary dark:bg-dark-primary">
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    {/* 1. Header Section (Title & Badges) */}
                    <Text className="text-2xl font-bold mb-2 text-light-text_main dark:text-dark-text_main">
                        {daily?.data.title}
                    </Text>

                    <View className="flex-row flex-wrap gap-2 mb-6">
                        {/* Difficulty Badge */}
                        <View
                            className={`px-2 py-1 rounded ${
                                daily?.data.difficulty === "Easy"
                                    ? "bg-green-700"
                                    : daily?.data.difficulty === "Medium"
                                    ? "bg-yellow-700"
                                    : "bg-red-700"
                            }`}
                        >
                            <Text className="font-bold text-xs text-light-text_sub dark:text-dark-text_sub">
                                {daily?.data.difficulty}
                            </Text>
                        </View>

                        {/* Topic Tags */}
                        {daily?.data.topic_tags?.map((tag) => (
                            <View
                                key={tag}
                                className="bg-light-surface dark:bg-dark-surface px-2 py-1 rounded"
                            >
                                <Text className="text-xs text-light-text_sub dark:text-dark-text_sub">
                                    {tag}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* 2. Description Renderer */}
                    {/* We check both 'content' and 'description' to be safe */}
                    <ProblemDescription
                        htmlContent={
                            daily?.data.content || daily?.data.description
                        }
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
};

export default Problems;
