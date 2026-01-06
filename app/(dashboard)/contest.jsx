import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { leetcodeAPI } from "../../services/api";
import { useRouter } from "expo-router";

const Contest = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(0);
    const [isListEnd, setIsListEnd] = useState(false);

    const fetchProblems = async () => {
        if (loading || isListEnd) return;

        setLoading(true);
        try {
            // Pass the current 'skip' value to your API
            const response = await leetcodeAPI.problems(skip);
            const newProblems = response.data.problems || [];

            if (newProblems.length > 0) {
                // Append new problems to the existing list
                setProblems((prev) => [...prev, ...newProblems]);
                // Increase the skip for the next batch (e.g., +20)
                setSkip((prev) => prev + 50);
            } else {
                // If API returns empty, we are done
                setIsListEnd(true);
            }
        } catch (error) {
            console.error("Failed to fetch problems:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial Fetch (Component Mount)
    useEffect(() => {
        fetchProblems();
    }, []);

    // Render a spinner at the bottom while loading more
    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View className="py-4">
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        );
    };
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 p-4">
            <Text className="text-xl font-bold mb-4">Contest Problems</Text>

            <FlatList
                data={problems}
                keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique keys
                // 👇 THE PAGINATION MAGIC
                onEndReached={fetchProblems}
                onEndReachedThreshold={0.5} // Trigger when user is 50% from bottom
                ListFooterComponent={renderFooter} // Spinner at bottom
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => router.push(`/problem/${item.slug}`)}
                    >
                        <View className="p-3 mb-2 bg-gray-100 rounded-lg">
                            <Text className="font-semibold">{item.title}</Text>
                            <Text
                                className={`text-sm ${
                                    item.difficulty === "Easy"
                                        ? "text-green-600"
                                        : item.difficulty === "Medium"
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                }`}
                            >
                                {item.difficulty}
                            </Text>
                        </View>
                    </Pressable>
                )}
            />
        </SafeAreaView>
    );
};

export default Contest;
