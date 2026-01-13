import { useColorScheme } from "nativewind";
import React from "react";
import { useWindowDimensions, ScrollView } from "react-native";
import RenderHtml from "react-native-render-html";

const ProblemDescription = ({ htmlContent }) => {
    // 1. Get screen width to ensure images/content don't overflow
    const { width } = useWindowDimensions();
    const { colorScheme } = useColorScheme();

    // 2. Define custom styles for specific HTML tags
    const tagsStyles = {
        p: {
            fontSize: 16,
            lineHeight: 24,
            color: colorScheme === "dark" ? "#F1F5F9" : "#0F172A",
            marginBottom: 10,
        },
        code: {
            backgroundColor: colorScheme === "dark" ? "#334155" : "#f5f5f5",
            fontFamily: "Courier", // Monospace font for code
            padding: 4,
            borderRadius: 4,
            fontSize: 14,
        },
        pre: {
            backgroundColor: colorScheme === "dark" ? "#334155" : "#f5f5f5",
            padding: 10,
            borderRadius: 8,
            marginVertical: 10,
        },
        strong: {
            fontWeight: "bold",
            color: colorScheme === "dark" ? "#F1F5F9" : "#0F172A",
        },
        li: {
            marginBottom: 8,
            color: colorScheme === "dark" ? "#E0E7FF" : "#1E293B",
        },
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <RenderHtml
                contentWidth={width}
                source={{ html: htmlContent }}
                tagsStyles={tagsStyles}
            />
        </ScrollView>
    );
};

export default ProblemDescription;
