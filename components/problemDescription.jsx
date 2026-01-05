import React from "react";
import { useWindowDimensions, ScrollView } from "react-native";
import RenderHtml from "react-native-render-html";

const ProblemDescription = ({ htmlContent }) => {
    // 1. Get screen width to ensure images/content don't overflow
    const { width } = useWindowDimensions();

    // 2. Define custom styles for specific HTML tags
    const tagsStyles = {
        p: {
            fontSize: 16,
            lineHeight: 24,
            color: "#333", // Dark text
            marginBottom: 10,
        },
        code: {
            backgroundColor: "#f0f0f0",
            fontFamily: "Courier", // Monospace font for code
            padding: 4,
            borderRadius: 4,
            fontSize: 14,
        },
        pre: {
            backgroundColor: "#f5f5f5",
            padding: 10,
            borderRadius: 8,
            marginVertical: 10,
        },
        strong: {
            fontWeight: "bold",
            color: "#000",
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
