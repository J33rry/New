import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { leetcodeAPI } from "../../services/api";
import ProblemDescription from "../../components/problemDescription";

const ProblemDetails = () => {
    const { id } = useLocalSearchParams();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await leetcodeAPI.getProblemDetails(id);
                setDetails(response.data);
            } catch (error) {
                console.error("Failed to fetch problem details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#6200ee" />
            </SafeAreaView>
        );
    }

    if (!details || !details.data) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text>Problem not found</Text>
            </SafeAreaView>
        );
    }

    const problem = details.data;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* 1. Header Section (Title & Badges) */}
                <Text className="text-2xl font-bold mb-2 text-gray-900">
                    {problem.title}
                </Text>

                <View className="flex-row flex-wrap gap-2 mb-6">
                    {/* Difficulty Badge */}
                    <View
                        className={`px-2 py-1 rounded ${
                            problem.difficulty === "Easy"
                                ? "bg-green-100"
                                : problem.difficulty === "Medium"
                                ? "bg-yellow-100"
                                : "bg-red-100"
                        }`}
                    >
                        <Text
                            className={`font-bold text-xs ${
                                problem.difficulty === "Easy"
                                    ? "text-green-700"
                                    : problem.difficulty === "Medium"
                                    ? "text-yellow-800"
                                    : "text-red-700"
                            }`}
                        >
                            {problem.difficulty}
                        </Text>
                    </View>

                    {/* Topic Tags */}
                    {problem.topic_tags?.map((tag) => (
                        <View
                            key={tag}
                            className="bg-gray-100 px-2 py-1 rounded"
                        >
                            <Text className="text-xs text-gray-600">{tag}</Text>
                        </View>
                    ))}
                </View>

                {/* 2. Description Renderer */}
                {/* We check both 'content' and 'description' to be safe */}
                <ProblemDescription
                    htmlContent={problem.content || problem.description}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProblemDetails;
