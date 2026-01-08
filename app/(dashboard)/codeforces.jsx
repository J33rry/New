import {
    View,
    Text,
    TextInput,
    FlatList,
    Pressable,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { codeforcesAPI } from "../../services/api"; // Ensure this matches your export
import { SafeAreaView } from "react-native-safe-area-context";

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const CodeforcesList = () => {
    const router = useRouter();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Search State
    const [searchKeywords, setSearchKeywords] = useState("");
    const debouncedSearch = useDebounce(searchKeywords, 500);

    // Pagination State
    const [skip, setSkip] = useState(0);
    const [isListEnd, setIsListEnd] = useState(false);

    const fetchProblems = async ({ reset = false } = {}) => {
        // If loading AND NOT resetting, stop (prevents double pagination calls)
        if (loading && !reset) return;

        setLoading(true);

        try {
            const currentSkip = reset ? 0 : skip;

            let filterOptions = {};
            if (debouncedSearch) {
                filterOptions.searchKeywords = debouncedSearch;
            }

            // Assuming your API accepts { limit, skip, filters }
            const response = await codeforcesAPI.problems({
                limit: 50,
                skip: currentSkip,
                filters: filterOptions,
            });

            // Handle response structure safety
            const newProblems = response.data?.problems || response.data || [];

            if (reset) {
                setProblems(newProblems);
                setSkip(50);
            } else {
                setProblems((prev) => [...prev, ...newProblems]);
                setSkip((prev) => prev + 50);
            }

            // If we got fewer than 50 items, we reached the end
            setIsListEnd(newProblems.length < 50);
        } catch (error) {
            console.error("Failed to fetch problems:", error);
        } finally {
            setLoading(false);
        }
    };

    // Effect: Triggers on Search Change
    useEffect(() => {
        setSkip(0);
        setIsListEnd(false);
        fetchProblems({ reset: true });
    }, [debouncedSearch]);

    const loadMore = () => {
        if (!loading && !isListEnd) {
            fetchProblems({ reset: false });
        }
    };

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        );
    };

    const handleProblemPress = (item) => {
        // Navigate to your detail page: app/codeforces/[contestId]/[index].js
        // console.log(item);
        router.push(`/codeforces/${item.contest_id}-${item.problem_index}`);
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-4">
            <Text className="text-xl font-bold mb-4">
                Codeforces Problemset
            </Text>

            <TextInput
                className="border border-gray-300 rounded-md p-3 mb-4 bg-gray-50"
                placeholder="Search by name..."
                value={searchKeywords}
                onChangeText={setSearchKeywords}
                autoCapitalize="none"
            />

            <FlatList
                data={problems}
                // Use the unique problem_id from your schema (e.g. "2182G")
                keyExtractor={(item, index) =>
                    item.problem_id || `${item.id}-${index}`
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={
                    !loading && (
                        <View className="mt-20 items-center">
                            <Text className="text-gray-500 text-lg">
                                No problems found.
                            </Text>
                        </View>
                    )
                }
                renderItem={({ item }) => (
                    <Pressable onPress={() => handleProblemPress(item)}>
                        {/* <Pressable> */}
                        <View className="p-4 mb-3 bg-gray-100 rounded-lg border border-gray-200">
                            {/* Problem Name & Index */}
                            <Text className="font-bold text-lg text-gray-800">
                                {item.problem_index}. {item.name}
                            </Text>

                            {/* Tags Row */}
                            {item.tags && item.tags.length > 0 && (
                                <View className="flex-row flex-wrap gap-2 mt-2">
                                    {item.tags.slice(0, 3).map((tag, idx) => (
                                        <View
                                            key={idx}
                                            className="bg-gray-200 px-2 py-1 rounded"
                                        >
                                            <Text className="text-xs text-gray-600 capitalize">
                                                {tag}
                                            </Text>
                                        </View>
                                    ))}
                                    {item.tags.length > 3 && (
                                        <Text className="text-xs text-gray-500 self-center">
                                            +{item.tags.length - 3} more
                                        </Text>
                                    )}
                                </View>
                            )}

                            {/* Context ID (Bottom Right) */}
                            <Text className="absolute bottom-2 right-3 text-xs text-gray-400">
                                Contest {item.contest_id}
                            </Text>
                        </View>
                    </Pressable>
                )}
            />
        </SafeAreaView>
    );
};

export default CodeforcesList;
