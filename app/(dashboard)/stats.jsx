import { View, Text, Pressable, FlatList, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { leetcodeAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LeetCodeHeatmap from "../../components/heatMap";

const Stats = () => {
    const [stats, setStats] = useState(null);
    const { user, details } = useAuth();

    const getStats = async () => {
        // console.log(details);
        const res = await leetcodeAPI.userStats(details.userId);
        setStats(res.data);
        // console.log(res.data);
    };
    useEffect(() => {
        if (details.userId) {
            getStats();
        }
    }, [details.userId]);

    return (
        <ScrollView vertical className="flex-1 gap-4">
            <Text>Stats</Text>
            {stats ? (
                <View className="items-center">
                    <Text>Total Problems Solved: {stats.totalSolved}</Text>
                    <Text>Easy Problems Solved: {stats.easySolved}</Text>
                    <Text>Hard Problems Solved: {stats.hardSolved}</Text>
                    <Text>Medium Problems Solved: {stats.mediumSolved}</Text>
                    <Text>Ranking: {stats.ranking}</Text>
                    <FlatList
                        data={stats.recentSubmissions}
                        renderItem={({ item }) => (
                            <View>
                                <Text>{item.title}</Text>
                                <Text>{item.lang}</Text>
                            </View>
                        )}
                    />
                    <LeetCodeHeatmap calendarString={stats.calendar} />
                </View>
            ) : (
                <Text>Loading stats...</Text>
            )}
            <Pressable onPress={() => getStats()}>
                <Text>Refresh Stats</Text>
            </Pressable>
        </ScrollView>
    );
};

export default Stats;
