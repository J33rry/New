import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, useWindowDimensions } from "react-native";
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
} from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons"; // Using icons for 5 tabs
import { useColorScheme } from "nativewind";

const MultiToggleSwitch = ({ tabs, onToggle, initialIndex = 0 }) => {
    const { width } = useWindowDimensions();
    const [activeIndex, setActiveIndex] = useState(initialIndex);

    // Dynamic Width: Full width minus padding (e.g., 32px total margin)
    const CONTAINER_WIDTH = width - 40;
    const TAB_WIDTH = CONTAINER_WIDTH / tabs.length;

    // Animation Value
    const translateX = useSharedValue(initialIndex * TAB_WIDTH);

    useEffect(() => {
        // Sync animation if initialIndex changes externally
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
    const { colorScheme } = useColorScheme();

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <View
            className="self-center bg-light-surface dark:bg-dark-surface rounded-full h-14 flex-row relative items-center justify-between shadow-lg shadow-light-text_sub/20 dark:shadow-dark-text_sub/20 border-2 border-t-0 border-b-2 border-light-border_color/70 dark:border-dark-border_color/70"
            style={{ width: CONTAINER_WIDTH }}
        >
            {/* 1. The Sliding Pill Background */}
            <Animated.View
                className="absolute left-0 h-12 bg-light-primary dark:bg-dark-primary rounded-full shadow-sm"
                style={[
                    {
                        width: TAB_WIDTH - 8, // slight margin
                        marginHorizontal: 4,
                    },
                    animatedStyle,
                ]}
            />

            {/* 2. The Tab Icons */}
            {tabs.map((iconName, index) => {
                const isActive = activeIndex === index;

                return (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={1}
                        onPress={() => handlePress(index)}
                        style={{ width: TAB_WIDTH }}
                        className="h-full justify-center items-center z-10"
                    >
                        <FontAwesome5
                            name={iconName}
                            size={20}
                            color={
                                isActive
                                    ? colorScheme === "dark"
                                        ? "#F1F5F9"
                                        : "#0F172A"
                                    : colorScheme === "dark"
                                    ? "#94A3B8"
                                    : "#64748B"
                            }
                            style={isActive ? { fontWeight: "bold" } : {}}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default MultiToggleSwitch;
