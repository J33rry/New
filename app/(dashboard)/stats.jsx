import { View, Text, Pressable, FlatList, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { codeforcesAPI, leetcodeAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LeetCodeHeatmap from "../../components/heatMap";

const Stats = () => {
    const [leetcodeStats, setLeetcodeStats] = useState(null);
    const [codeforcesStats, setCodeforcesStats] = useState(null);
    const { user, details } = useAuth();

    const getStats = async () => {
        // console.log(details);
        const resleetcode = await leetcodeAPI.userStats(details.userId);
        const resCodeForces = await codeforcesAPI.userStats(details.userId);
        // console.log(resCodeForces);

        setLeetcodeStats(resleetcode.data);
        setCodeforcesStats(resCodeForces.data);
        // console.log(codeforcesStats);
    };
    useEffect(() => {
        if (details.userId) {
            getStats();
        }
    }, [details.userId]);

    return (
        <ScrollView vertical className="flex-1 gap-4">
            <Text>Stats</Text>
            {leetcodeStats ? (
                <View className="items-center">
                    <Text>
                        Total Problems Solved: {leetcodeStats.totalSolved}
                    </Text>
                    <Text>
                        Easy Problems Solved: {leetcodeStats.easySolved}
                    </Text>
                    <Text>
                        Hard Problems Solved: {leetcodeStats.hardSolved}
                    </Text>
                    <Text>
                        Medium Problems Solved: {leetcodeStats.mediumSolved}
                    </Text>
                    <Text>Ranking: {leetcodeStats.ranking}</Text>
                    <FlatList
                        data={leetcodeStats.recentSubmissions}
                        renderItem={({ item }) => (
                            <View>
                                <Text>{item.title}</Text>
                                <Text>{item.lang}</Text>
                            </View>
                        )}
                    />
                    {/* <LeetCodeHeatmap calendarString={leetcodeStats.calendar} /> */}
                </View>
            ) : (
                <Text>Loading leetcodeStats stats...</Text>
            )}

            {codeforcesStats ? (
                <View className="items-center">
                    <Text>rating: {codeforcesStats.rating}</Text>
                    <Text>MaxRating : {codeforcesStats.max_rating}</Text>
                    <Text>Rank: {codeforcesStats.rank}</Text>
                    <Text>MaxRank: {codeforcesStats.max_rank}</Text>

                    <FlatList
                        data={codeforcesStats.contests}
                        renderItem={({ item }) => (
                            <View>
                                <Text>{item.contestId}</Text>
                                <Text>{item.contestName}</Text>
                                <Text>{item.rank}</Text>
                                <Text>{item.oldRating}</Text>
                                <Text>{item.newRating}</Text>
                            </View>
                        )}
                    />
                </View>
            ) : (
                <Text>Loading codeforcesStats stats...</Text>
            )}
            <Pressable onPress={() => getStats()}>
                <Text>Refresh Stats</Text>
            </Pressable>
        </ScrollView>
    );
};

export default Stats;
