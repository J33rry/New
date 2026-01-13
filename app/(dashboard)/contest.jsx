import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Pressable,
    TextInput,
    useWindowDimensions,
    TouchableOpacity,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { codeforcesAPI, leetcodeAPI } from "../../services/api";
import { useRouter } from "expo-router";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

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

    // UI State
    const [current, setCurrent] = useState("Leetcode");
    const [searchKeywords, setSearchKeywords] = useState("");
    const [difficulty, setDifficulty] = useState(null);
    const debouncedSearch = useDebounce(searchKeywords, 500);
    const [loading, setLoading] = useState(false);

    // --- 1. SEPARATE STATE FOR EACH TAB ---
    // This keeps the data in memory when you switch away
    const [leetcodeData, setLeetcodeData] = useState({
        list: [],
        skip: 0,
        isEnd: false,
        loaded: false,
    });

    const [codeforcesData, setCodeforcesData] = useState({
        list: [],
        skip: 0,
        isEnd: false,
        loaded: false,
    });

    const difficultyLevels = ["EASY", "MEDIUM", "HARD"];
    const Tabs = ["Leetcode", "Codeforce"];

    // --- 2. FETCH FUNCTION ---
    const fetchProblems = useCallback(
        async ({ type, reset = false } = {}) => {
            if (loading) return;
            setLoading(true);

            try {
                // Determine which state to use
                const isLeetCode = type === "Leetcode";
                const currentState = isLeetCode ? leetcodeData : codeforcesData;

                // If we are NOT resetting and already at the end, stop.
                if (!reset && currentState.isEnd) {
                    setLoading(false);
                    return;
                }

                const currentSkip = reset ? 0 : currentState.skip;
                let newProblems = [];

                if (isLeetCode) {
                    let filterOptions = {};
                    if (difficulty) filterOptions.difficulty = difficulty;
                    if (debouncedSearch)
                        filterOptions.searchKeywords = debouncedSearch;

                    const response = await leetcodeAPI.problems({
                        limit: 50,
                        skip: currentSkip,
                        filters: filterOptions,
                    });
                    newProblems = response.data.problems || [];
                } else {
                    let filterOptions = {};
                    if (debouncedSearch)
                        filterOptions.searchKeywords = debouncedSearch;

                    const response = await codeforcesAPI.problems({
                        limit: 50,
                        skip: currentSkip,
                        filters: filterOptions,
                    });
                    newProblems =
                        response.data?.problems || response.data || [];
                }

                // Update the SPECIFIC state based on 'type'
                const updateState = isLeetCode
                    ? setLeetcodeData
                    : setCodeforcesData;

                updateState((prev) => ({
                    list: reset ? newProblems : [...prev.list, ...newProblems],
                    skip: reset ? 50 : prev.skip + 50,
                    isEnd: newProblems.length < 50,
                    loaded: true, // Mark as loaded so we don't auto-fetch again
                }));
            } catch (error) {
                console.error(`Failed to fetch ${type}:`, error);
            } finally {
                setLoading(false);
            }
        },
        [difficulty, debouncedSearch, leetcodeData, codeforcesData, loading]
    );

    // --- 3. INTELLIGENT EFFECT ---
    // Triggers when Tab changes OR Filter changes
    useEffect(() => {
        const isLeetCode = current === "Leetcode";
        const currentState = isLeetCode ? leetcodeData : codeforcesData;

        // Condition A: Filters changed? We MUST reset and fetch.
        // (We detect filter change by checking if we need to apply search/difficulty but list is stale)
        // Ideally, we just check if it's the *initial load* of the tab OR a filter change.

        // Simpler Logic:
        // If this tab has NEVER been loaded, fetch it.
        if (!currentState.loaded) {
            fetchProblems({ type: current, reset: true });
        }
        // If filters changed, we force a refresh (you might want to track 'lastFilters' to be precise,
        // but for now, we rely on the dependency array of useEffect.
        // NOTE: This effect runs on `difficulty` change. If `difficulty` changes, we must refetch.
    }, [current]);

    // Separate effect for FILTERS to force reset
    useEffect(() => {
        // When filters change, we MUST fetch fresh data for the CURRENT tab
        fetchProblems({ type: current, reset: true });
    }, [difficulty, debouncedSearch]);

    // --- HANDLERS ---

    const loadMore = () => {
        // Only load more for the ACTIVE tab
        fetchProblems({ type: current, reset: false });
    };

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View className="py-4">
                <ActivityIndicator size="small" color="#4F46E5" />
            </View>
        );
    };

    // Helper to get the correct list for rendering
    const activeList =
        current === "Leetcode" ? leetcodeData.list : codeforcesData.list;

    return (
        <SafeAreaView className="flex-1 bg-light-primary dark:bg-dark-primary p-4">
            <Text className="text-2xl font-bold text-light-text_main dark:text-dark-text_main mb-4">
                Problems
            </Text>

            <View className="items-center justify-center flex-row mb-6">
                <MultiSwitch
                    tabs={Tabs}
                    onToggle={setCurrent}
                    initialIndex={current === "Leetcode" ? 0 : 1}
                />
            </View>

            <TextInput
                className="border border-light-border_color dark:border-dark-border_color rounded-xl p-4 mb-4 h-14 bg-light-surface dark:bg-dark-surface text-light-text_main dark:text-dark-text_main"
                placeholder={`Search ${current}...`}
                value={searchKeywords}
                onChangeText={setSearchKeywords}
                placeholderTextColor="#9CA3AF"
            />

            {current === "Leetcode" && (
                <View className="mb-4 h-10">
                    <FlatList
                        data={difficultyLevels}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 8 }}
                        renderItem={({ item }) => (
                            <Pressable
                                className={`px-4 py-2 border rounded-full ${
                                    difficulty === item
                                        ? "bg-light-surface dark:bg-dark-surface border-light-text_main dark:border-dark-text_main"
                                        : "bg-transparent border-light-border_color dark:border-dark-border_color"
                                }`}
                                onPress={() =>
                                    setDifficulty((prev) =>
                                        prev === item ? null : item
                                    )
                                }
                            >
                                <Text
                                    className={`text-sm font-medium ${
                                        item === "EASY"
                                            ? "text-green-600"
                                            : item === "MEDIUM"
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
            )}

            <View className="flex-1">
                <FlatList
                    data={activeList} // 4. RENDER FROM SEPARATE STATE
                    keyExtractor={(item, index) =>
                        item.id
                            ? `${item.id}-${index}`
                            : `${item.problem_index}-${item.name}`
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={
                        !loading && (
                            <Text className="text-center mt-10 text-gray-500">
                                No problems found.
                            </Text>
                        )
                    }
                    renderItem={({ item }) => {
                        if (current === "Leetcode") {
                            return (
                                <Pressable
                                    onPress={() =>
                                        router.push(`/problem/${item.slug}`)
                                    }
                                >
                                    <View className="p-4 mb-2 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border_color dark:border-dark-border_color">
                                        <Text className="font-semibold text-lg text-light-text_main dark:text-dark-text_main">
                                            {item.title}
                                        </Text>
                                        <Text
                                            className={`text-sm font-medium mt-1 ${
                                                item.difficulty === "Easy"
                                                    ? "text-green-600"
                                                    : item.difficulty ===
                                                      "Medium"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {item.difficulty}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        } else {
                            return (
                                <Pressable
                                    onPress={() =>
                                        router.push(
                                            `/codeforces/${item.contest_id}-${item.problem_index}`
                                        )
                                    }
                                    className="p-4 mb-3 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border_color dark:border-dark-border_color"
                                >
                                    <Text className="font-bold text-lg text-light-text_main dark:text-dark-text_main">
                                        {item.problem_index}. {item.name}
                                    </Text>
                                    <View className="flex-row flex-wrap gap-2 mt-2">
                                        {item.tags
                                            ?.slice(0, 3)
                                            .map((tag, idx) => (
                                                <View
                                                    key={idx}
                                                    className="bg-light-primary dark:bg-dark-primary px-2 py-1 rounded border border-light-border_color dark:border-dark-border_color"
                                                >
                                                    <Text className="text-xs text-light-text_sub dark:text-dark-text_sub">
                                                        {tag}
                                                    </Text>
                                                </View>
                                            ))}
                                    </View>
                                </Pressable>
                            );
                        }
                    }}
                />
            </View>
        </SafeAreaView>
    );
};
// --- MultiSwitch Component ---
const MultiSwitch = ({ tabs, onToggle, initialIndex = 0 }) => {
    const { width } = useWindowDimensions();
    const [activeIndex, setActiveIndex] = useState(initialIndex);

    // Dynamic width calculation to prevent overflow
    // (Width - Padding) / NumTabs
    const CONTAINER_WIDTH = width - 40;
    const TAB_WIDTH = CONTAINER_WIDTH / tabs.length;

    const translateX = useSharedValue(initialIndex * TAB_WIDTH);

    useEffect(() => {
        translateX.value = withSpring(initialIndex * TAB_WIDTH);
        setActiveIndex(initialIndex);
    }, [initialIndex, TAB_WIDTH]);

    const handlePress = (index) => {
        setActiveIndex(index);
        translateX.value = withSpring(index * TAB_WIDTH, {
            damping: 15,
            stiffness: 120,
        });
        if (onToggle) onToggle(tabs[index], index);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <View
            className="self-center bg-light-surface dark:bg-dark-surface rounded-full h-14 flex-row relative items-center justify-between border border-light-border_color dark:border-dark-border_color"
            style={{ width: CONTAINER_WIDTH }}
        >
            <Animated.View
                className="absolute left-0 h-12 bg-light-primary dark:bg-dark-primary rounded-full shadow-sm"
                style={[
                    {
                        width: TAB_WIDTH - 8,
                        marginHorizontal: 4,
                    },
                    animatedStyle,
                ]}
            />

            {tabs.map((name, index) => {
                const isActive = activeIndex === index;
                return (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={1}
                        onPress={() => handlePress(index)}
                        style={{ width: TAB_WIDTH }}
                        className="h-full justify-center items-center z-10"
                    >
                        <Text
                            className={`text-lg font-semibold ${
                                isActive
                                    ? "text-light-text_main dark:text-dark-text_main"
                                    : "text-light-text_sub dark:text-dark-text_sub"
                            }`}
                        >
                            {name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default Contest;
