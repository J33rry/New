import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Pressable,
    TextInput,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { leetcodeAPI } from "../../services/api";
import { useRouter } from "expo-router";

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const Contest = () => {
    const router = useRouter();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchKeywords, setSearchKeywords] = useState("");
    const [difficulty, setDifficulty] = useState(null);

    const debouncedSearch = useDebounce(searchKeywords, 500);

    const [skip, setSkip] = useState(0);
    const [isListEnd, setIsListEnd] = useState(false);

    const difficultyLevels = ["EASY", "MEDIUM", "HARD"];

    const fetchProblems = async ({ reset = false } = {}) => {
        if (loading) return;

        setLoading(true);

        try {
            const currentSkip = reset ? 0 : skip;

            let filteroptions = {};

            if (difficulty) {
                filteroptions = {
                    difficulty: difficulty,
                };
            }
            if (debouncedSearch) {
                filteroptions = {
                    ...filteroptions,
                    searchKeywords: debouncedSearch,
                };
            }
            const response = await leetcodeAPI.problems({
                limit: 50,
                skip: currentSkip,
                filters: filteroptions,
            });

            const newProblems = response.data.problems || [];

            if (reset) {
                setProblems(newProblems);
                setSkip(50);
            } else {
                setProblems((prev) => [...prev, ...newProblems]);
                setSkip((prev) => prev + 50);
            }

            setIsListEnd(newProblems.length < 50);
        } catch (error) {
            console.error("Failed to fetch problems:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setSkip(0);
        setIsListEnd(false);
        fetchProblems({ reset: true });
    }, [difficulty, debouncedSearch]);

    const loadMore = () => {
        if (!loading && !isListEnd) {
            fetchProblems({ reset: false });
        }
    };

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View className="py-4">
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 p-4">
            <Text className="text-xl font-bold mb-4">Contest Problems</Text>

            <TextInput
                className="border border-gray-300 rounded-md p-2 mb-4"
                placeholder="Search problems..."
                value={searchKeywords}
                onChangeText={setSearchKeywords}
            />

            <View className="mb-4">
                <FlatList
                    data={difficultyLevels}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Pressable
                            className={`mr-2 px-4 py-2 border rounded-full ${
                                difficulty === item
                                    ? "bg-black border-black"
                                    : "bg-white border-gray-300"
                            }`}
                            onPress={() => {
                                setDifficulty((prev) =>
                                    prev === item ? null : item
                                );
                            }}
                        >
                            <Text
                                className={`text-sm ${
                                    item.difficulty === "EASY"
                                        ? "text-green-600"
                                        : item.difficulty === "MEDIUM"
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                }`}
                            >
                                {item}
                            </Text>
                        </Pressable>
                    )}
                    keyExtractor={(item) => item}
                />
            </View>

            <FlatList
                data={problems}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                onEndReached={loadMore}
                onEndReachedThreshold={0.8}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={
                    !loading && (
                        <Text className="text-center text-gray-500 mt-10">
                            No problems found.
                        </Text>
                    )
                }
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => router.push(`/problem/${item.slug}`)}
                    >
                        <View className="p-3 mb-2 bg-gray-100 rounded-lg">
                            <Text className="font-semibold">{item.title}</Text>
                            <View className="flex-row justify-between mt-1">
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
                        </View>
                    </Pressable>
                )}
            />
        </SafeAreaView>
    );
};

export default Contest;
