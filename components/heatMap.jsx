import React, { useMemo } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import { ContributionGraph } from "react-native-chart-kit";

// Get screen width to make the chart responsive
const screenWidth = Dimensions.get("window").width;

const LeetCodeHeatmap = ({ calendarString }) => {
    const chartData = useMemo(() => {
        try {
            // Step A: Parse the double-stringified JSON
            const parsed = JSON.parse(calendarString);

            // Step B: Map keys (timestamps) to array
            return Object.entries(parsed).map(([timestamp, count]) => {
                // LeetCode uses seconds, JS Date uses milliseconds
                const dateObj = new Date(parseInt(timestamp) * 1000);

                // Format to YYYY-MM-DD
                const dateString = dateObj.toISOString().split("T")[0];

                return {
                    date: dateString,
                    count: count,
                };
            });
        } catch (e) {
            console.error("Error parsing calendar data", e);
            return [];
        }
    }, [calendarString]);

    // 2. Define Chart Configuration (LeetCode Green Theme)
    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        color: (opacity = 1) => `rgba(0, 152, 0, ${opacity})`, // LeetCode Green
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
    };

    return (
        <ScrollView horizontal style={styles.container}>
            {/* <Text style={styles.title}>Submission Activity</Text> */}

            {chartData.length > 0 ? (
                <ContributionGraph
                    values={chartData}
                    endDate={new Date()} // Adjust to show the relevant year window
                    numDays={105} // How many days back to show (approx 3 months fits well on mobile)
                    width={screenWidth - 30}
                    height={220}
                    chartConfig={chartConfig}
                    gutterSize={0.8} // Spacing between squares
                    bgColor={"transparent"} // Make background transparent
                    squareSize={20} // Size of the blocks
                    // Optional: handle clicks
                    onDayPress={(day) =>
                        console.log(`Clicked ${day.date}: ${day.count}`)
                    }
                />
            ) : (
                <Text>No Data Available</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: "white",
        borderRadius: 10,
        // alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        // alignSelf: "flex-center",
    },
});

export default LeetCodeHeatmap;
