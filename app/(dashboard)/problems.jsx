import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ProblemDescription from "../../components/problemDescription";
import { leetcodeAPI } from "../../services/api";

const Problems = () => {
    // const { getDailyProblem, daily, loading } = useProblem();
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
    return (
        <SafeAreaView className="flex-1 justify-center items-center gap-4">
            <Text>Problems</Text>
            {daily ? (
                <ProblemDescription htmlContent={daily.data?.content} />
            ) : (
                <Text>No daily problem loaded.</Text>
            )}
        </SafeAreaView>
    );
};

export default Problems;
