import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ProblemDescription from "../../components/problemDescription";
import { useProblem } from "../../context/problemContext";

const Problems = () => {
    const { getDailyProblem, daily, loading } = useProblem();

    // 2. Use useEffect to fetch data ONLY on mount
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
