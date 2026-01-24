import { useEffect, useMemo, useState } from "react"; // <--- Import useEffect
import {
    Dimensions,
    Image,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    ContributionGraph,
    PieChart,
    ProgressChart,
} from "react-native-chart-kit";
import { MaterialIcons } from "@expo/vector-icons";
import { authAPI } from "../../services/api.js";
import Header from "../../components/header.jsx";
import LoadingScreen from "../../components/loadingScreen.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Home = () => {
    const [loading, setLoading] = useState(false);
    const { userDetails, setUserDetails } = useAuth();
    const screenWidth = Dimensions.get("window").width;

    const getProfileData = async () => {
        setLoading(true);
        try {
            const response = await authAPI.getProfile();
            setUserDetails(response.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProfileData();
    }, []);

    const chartConfig = {
        backgroundGradientFrom: "#0F172A",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#0F172A",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(94, 234, 212, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(241, 245, 249, ${opacity})`,
        strokeWidth: 2,
        propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#0EA5E9",
        },
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
    };

    const leetcodeStatsRaw = userDetails?.leetcode_stats;
    const codeforcesStatsRaw = userDetails?.codeforces_stats;

    const leetcodeStats =
        leetcodeStatsRaw && typeof leetcodeStatsRaw === "object"
            ? leetcodeStatsRaw
            : {};
    const codeforcesStats =
        codeforcesStatsRaw && typeof codeforcesStatsRaw === "object"
            ? codeforcesStatsRaw
            : {};

    const isLeetcodeLinked =
        leetcodeStatsRaw && typeof leetcodeStatsRaw === "object";
    const isCodeforcesLinked =
        codeforcesStatsRaw && typeof codeforcesStatsRaw === "object";
    const profile = userDetails?.profile || {};

    const solvedTotal = leetcodeStats.total_problems_solved || 0;
    const totalQuestions = leetcodeStats.total_questions || 1;
    const solvedBreakdown = {
        easy: leetcodeStats.easy_problems_solved || 0,
        medium: leetcodeStats.medium_problems_solved || 0,
        hard: leetcodeStats.hard_problems_solved || 0,
    };

    const contributionData = useMemo(() => {
        if (!leetcodeStats.calendar) return [];
        try {
            const parsed = JSON.parse(leetcodeStats.calendar);
            return Object.entries(parsed).map(([timestamp, count]) => ({
                date: new Date(Number(timestamp) * 1000)
                    .toISOString()
                    .split("T")[0],
                count,
            }));
        } catch (e) {
            console.warn("Failed to parse calendar", e);
            return [];
        }
    }, [leetcodeStats.calendar]);

    const totalContributions = useMemo(
        () => contributionData.reduce((sum, day) => sum + (day.count || 0), 0),
        [contributionData]
    );

    const difficultyChartData = useMemo(
        () => [
            {
                name: "Easy",
                count: solvedBreakdown.easy,
                color: "#22d3ee",
                legendFontColor: "#E2E8F0",
                legendFontSize: 13,
            },
            {
                name: "Medium",
                count: solvedBreakdown.medium,
                color: "#fbbf24",
                legendFontColor: "#E2E8F0",
                legendFontSize: 13,
            },
            {
                name: "Hard",
                count: solvedBreakdown.hard,
                color: "#ef4444",
                legendFontColor: "#E2E8F0",
                legendFontSize: 13,
            },
        ],
        [solvedBreakdown.easy, solvedBreakdown.medium, solvedBreakdown.hard]
    );

    const solvedPercent = solvedTotal / totalQuestions;
    const attemptingCount = (leetcodeStats.recent_submission || []).length;
    const contestsCount = (codeforcesStats.contests || []).length;

    const recentSubmissions = useMemo(() => {
        if (!Array.isArray(leetcodeStats.recent_submission)) return [];
        return leetcodeStats.recent_submission.slice(0, 6).map((item, idx) => {
            const title = item.title || item.name || `Submission ${idx + 1}`;
            const status =
                item.statusDisplay || item.status || item.verdict || "—";
            const lang = item.lang || item.language || "";
            const time = item.timestamp || item.time || item.submissionTime;
            const formattedTime = time
                ? new Date(Number(time) * 1000).toLocaleDateString()
                : "";
            return { title, status, lang, formattedTime };
        });
    }, [leetcodeStats.recent_submission]);

    const recentContests = useMemo(() => {
        if (!Array.isArray(codeforcesStats.contests)) return [];
        return codeforcesStats.contests.slice(0, 4).map((item, idx) => {
            const name = item.contestName || `Contest ${idx + 1}`;
            const rank = item.rank ?? "—";
            const newRating = item.newRating ?? 0;
            const oldRating = item.oldRating ?? 0;
            const delta = newRating - oldRating;
            const time = item.ratingUpdateTimeSeconds || item.timeSeconds;
            const formattedTime = time
                ? new Date(Number(time) * 1000).toLocaleDateString()
                : "";
            return { name, rank, newRating, delta, formattedTime };
        });
    }, [codeforcesStats.contests]);

    const formatNumber = (value) => {
        if (value === undefined || value === null) return "—";
        return value.toLocaleString();
    };

    const avatarSource = profile.avatar_icon
        ? { uri: profile.avatar_icon }
        : null;

    return (
        <SafeAreaView className="flex-1 bg-light-primary dark:bg-dark-primary">
            {loading ? (
                <LoadingScreen message="Syncing your dashboard stats..." />
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 32,
                    }}
                >
                    <View className="mt-4">
                        <Header data={userDetails} />

                        {/* Profile card */}
                        <View className="bg-light-surface dark:bg-dark-surface rounded-2xl p-5 mt-4 border border-slate-800/60">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-1">
                                    <Text className="text-2xl font-semibold text-light-text_main dark:text-dark-text_main">
                                        {profile.display_name ||
                                            profile.leetcode_user ||
                                            "Coder"}
                                    </Text>
                                    <Text className="text-sm text-slate-400 mt-1">
                                        @{profile.leetcode_user || "leet-user"}
                                    </Text>
                                </View>
                                <View className="w-14 h-14 rounded-full bg-slate-700/40 items-center justify-center overflow-hidden">
                                    {avatarSource ? (
                                        <Image
                                            source={avatarSource}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Text className="text-xl text-slate-200 font-semibold">
                                            {(
                                                profile.display_name || "C"
                                            ).slice(0, 1)}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <View className="flex-row items-center justify-between mt-4">
                                {[
                                    {
                                        label: "Ranking",
                                        value: formatNumber(
                                            leetcodeStats.ranking
                                        ),
                                    },
                                    {
                                        label: "Rating",
                                        value: formatNumber(
                                            codeforcesStats.rating ||
                                                codeforcesStats.max_rating
                                        ),
                                    },
                                    {
                                        label: "Contribution",
                                        value: formatNumber(totalContributions),
                                    },
                                ].map((item) => (
                                    <View
                                        key={item.label}
                                        className="flex-1 items-center"
                                    >
                                        <Text className="text-2xl font-semibold text-light-text_main dark:text-dark-text_main">
                                            {item.value}
                                        </Text>
                                        <Text className="text-slate-400 mt-1 text-sm">
                                            {item.label}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Split charts */}
                        <View className="flex-row mt-4 gap-3">
                            <View className="flex-1 bg-light-surface dark:bg-dark-surface rounded-2xl p-4 border border-slate-800/60">
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="text-light-text_main dark:text-dark-text_main font-semibold">
                                        Difficulty split
                                    </Text>
                                    <MaterialIcons
                                        name="pie-chart"
                                        size={20}
                                        color="#22d3ee"
                                    />
                                </View>
                                <PieChart
                                    data={difficultyChartData}
                                    width={screenWidth / 2 - 24}
                                    height={160}
                                    chartConfig={chartConfig}
                                    accessor="count"
                                    backgroundColor="transparent"
                                    paddingLeft={screenWidth / 10}
                                    hasLegend={false}
                                    center={[0, 0]}
                                />
                                <View className="flex-row justify-between mt-2">
                                    {difficultyChartData.map((d) => (
                                        <View
                                            key={d.name}
                                            className="items-center flex-1"
                                        >
                                            <View
                                                style={{
                                                    backgroundColor: d.color,
                                                }}
                                                className="w-2.5 h-2.5 rounded-full mb-1"
                                            />
                                            <Text className="text-slate-300 text-xs">
                                                {d.name}
                                            </Text>
                                            <Text className="text-light-text_main dark:text-dark-text_main font-semibold text-sm">
                                                {d.count}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View className="flex-1 bg-light-surface dark:bg-dark-surface rounded-2xl p-4 border border-slate-800/60">
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="text-light-text_main dark:text-dark-text_main font-semibold">
                                        Overall progress
                                    </Text>
                                    <MaterialIcons
                                        name="donut-large"
                                        size={20}
                                        color="#fbbf24"
                                    />
                                </View>
                                <ProgressChart
                                    data={{
                                        labels: ["Solved"],
                                        data: [Math.min(solvedPercent, 1)],
                                        colors: [() => "#22d3ee"],
                                    }}
                                    width={screenWidth / 2 - 24}
                                    height={180}
                                    strokeWidth={12}
                                    radius={28}
                                    chartConfig={chartConfig}
                                    hideLegend
                                />
                                <View className="items-center mt-2">
                                    <Text className="text-3xl font-bold text-light-text_main dark:text-dark-text_main">
                                        {solvedTotal}
                                        <Text className="text-base text-slate-400">
                                            /{totalQuestions}
                                        </Text>
                                    </Text>
                                    <Text className="text-slate-400 text-sm mt-1">
                                        {attemptingCount} Attempting
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Contribution heatmap */}
                        <View className="bg-light-surface dark:bg-dark-surface rounded-2xl p-4 mt-4 border border-slate-800/60">
                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="text-light-text_main dark:text-dark-text_main font-semibold">
                                    Submission calendar
                                </Text>
                                <MaterialIcons
                                    name="calendar-today"
                                    size={20}
                                    color="#22d3ee"
                                />
                            </View>
                            {contributionData.length ? (
                                <ContributionGraph
                                    values={contributionData}
                                    endDate={new Date()}
                                    numDays={140}
                                    width={screenWidth - 80}
                                    height={220}
                                    chartConfig={{
                                        ...chartConfig,
                                        color: (opacity = 1) =>
                                            `rgba(34, 211, 238, ${opacity})`,
                                    }}
                                    gutterSize={4}
                                    squareSize={16}
                                />
                            ) : (
                                <View className="items-center py-6">
                                    <Text className="text-slate-400">
                                        No submission data yet.
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Codeforces summary */}
                        <View className="bg-light-surface dark:bg-dark-surface rounded-2xl p-5 mt-4 border border-slate-800/60">
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-light-text_main dark:text-dark-text_main font-semibold text-lg">
                                        Codeforces
                                    </Text>
                                    <Text className="text-slate-400 text-sm mt-1">
                                        @{profile.codeforces_user || "cf-user"}
                                    </Text>
                                </View>
                                <MaterialIcons
                                    name="leaderboard"
                                    size={22}
                                    color="#a78bfa"
                                />
                            </View>

                            <View className="flex-row justify-between mt-4 gap-2">
                                {[
                                    {
                                        label: "Rating",
                                        value: formatNumber(
                                            codeforcesStats.rating || 0
                                        ),
                                        helper: codeforcesStats.max_rating
                                            ? `Best ${formatNumber(
                                                  codeforcesStats.max_rating
                                              )}`
                                            : "—",
                                    },
                                    {
                                        label: "Rank",
                                        value: codeforcesStats.rank || "—",
                                        helper: codeforcesStats.max_rank
                                            ? `Peak ${codeforcesStats.max_rank}`
                                            : "—",
                                    },
                                    {
                                        label: "Contests",
                                        value: contestsCount,
                                        helper: contestsCount
                                            ? "Participated"
                                            : "—",
                                    },
                                ].map((item) => (
                                    <View
                                        key={item.label}
                                        className="flex-1 bg-slate-800/40 rounded-xl p-3 border border-slate-700/60"
                                    >
                                        <Text className="text-slate-300 text-xs mb-1">
                                            {item.label}
                                        </Text>
                                        <Text className="text-light-text_main dark:text-dark-text_main text-xl font-semibold">
                                            {item.value}
                                        </Text>
                                        <Text className="text-slate-400 text-xs mt-1">
                                            {item.helper}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Recent contests */}
                        <View className="bg-light-surface dark:bg-dark-surface rounded-2xl p-5 mt-4 border border-slate-800/60">
                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="text-light-text_main dark:text-dark-text_main font-semibold">
                                    Recent contests
                                </Text>
                                <MaterialIcons
                                    name="flag"
                                    size={20}
                                    color="#a78bfa"
                                />
                            </View>

                            {!isCodeforcesLinked ? (
                                <Text className="text-slate-400 text-sm">
                                    Link your Codeforces account to see
                                    contests.
                                </Text>
                            ) : recentContests.length ? (
                                <View className="space-y-3">
                                    {recentContests.map((item, idx) => (
                                        <View
                                            key={`${item.name}-${idx}`}
                                            className="flex-row justify-between items-center bg-slate-800/30 rounded-xl p-3 border border-slate-700/40"
                                        >
                                            <View className="flex-1 pr-3">
                                                <Text className="text-light-text_main dark:text-dark-text_main font-semibold">
                                                    {item.name}
                                                </Text>
                                                <Text className="text-slate-400 text-xs mt-1">
                                                    {item.formattedTime}
                                                </Text>
                                            </View>
                                            <View className="items-end">
                                                <Text className="text-xs text-slate-300">
                                                    Rank
                                                </Text>
                                                <Text className="text-light-text_main dark:text-dark-text_main text-base font-semibold">
                                                    {item.rank}
                                                </Text>
                                                <Text
                                                    className={`text-sm font-semibold mt-1 ${
                                                        item.delta >= 0
                                                            ? "text-emerald-300"
                                                            : "text-rose-300"
                                                    }`}
                                                >
                                                    {item.delta >= 0 ? "+" : ""}
                                                    {item.delta}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text className="text-slate-400 text-sm">
                                    No contests found.
                                </Text>
                            )}
                        </View>

                        {/* Recent submissions */}
                        <View className="bg-light-surface dark:bg-dark-surface rounded-2xl p-5 mt-4 border border-slate-800/60">
                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="text-light-text_main dark:text-dark-text_main font-semibold">
                                    Recent submissions
                                </Text>
                                <MaterialIcons
                                    name="history"
                                    size={20}
                                    color="#22d3ee"
                                />
                            </View>

                            {!isLeetcodeLinked ? (
                                <Text className="text-slate-400 text-sm">
                                    Link your LeetCode account to see recent
                                    submissions.
                                </Text>
                            ) : recentSubmissions.length ? (
                                <View className="space-y-3">
                                    {recentSubmissions.map((item, idx) => (
                                        <View
                                            key={`${item.title}-${idx}`}
                                            className="flex-row justify-between items-center bg-slate-800/30 rounded-xl p-3 border border-slate-700/40"
                                        >
                                            <View className="flex-1 pr-3">
                                                <Text className="text-light-text_main dark:text-dark-text_main font-semibold">
                                                    {item.title}
                                                </Text>
                                                <Text className="text-slate-400 text-xs mt-1">
                                                    {item.lang || ""}
                                                </Text>
                                            </View>
                                            <View className="items-end">
                                                <Text className="text-xs text-slate-300">
                                                    {item.formattedTime}
                                                </Text>
                                                <Text className="text-sm font-semibold text-emerald-300">
                                                    {item.status}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text className="text-slate-400 text-sm">
                                    No recent submissions yet.
                                </Text>
                            )}
                        </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default Home;
