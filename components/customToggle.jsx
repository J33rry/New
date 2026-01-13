import { Link } from "expo-router";
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    Pressable,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    withTiming,
    withSpring,
} from "react-native-reanimated";

const CustomToggle = ({ onToggle, activeTabProp }) => {
    const [activeTab, setActiveTab] = useState(activeTabProp); // 'login' or 'signup'

    // Dimensions for the switch
    // You can make these dynamic or responsive if you prefer
    const SWITCH_WIDTH = 300;
    const SWITCH_HEIGHT = 50;
    const TAB_WIDTH = SWITCH_WIDTH / 2;

    // Animation logic
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withSpring(
                        activeTab === "login" ? 0 : TAB_WIDTH,
                        {
                            damping: 15,
                            stiffness: 120,
                        }
                    ),
                },
            ],
        };
    });

    const handlePress = (tab) => {
        setActiveTab(tab);
        if (onToggle) onToggle(tab); // Notify parent component
    };

    return (
        <View
            className="bg-light-primary dark:bg-dark-primary rounded-full overflow-hidden flex-row relative border-2 border-light-border_color dark:border-dark-border_color"
            style={{ width: SWITCH_WIDTH, height: SWITCH_HEIGHT }}
        >
            {/* 1. The Moving White Background Pill */}
            <Animated.View
                className="absolute top-0 bottom-0 left-0 bg-light-text_sub dark:bg-dark-text_sub rounded-full m-1 shadow-sm"
                style={[
                    { width: TAB_WIDTH - 8 }, // Minus margins to create the "padding" look
                    animatedStyle,
                ]}
            />

            {/* 2. The Text Labels (Clickable layers on top) */}
            <View className="flex-row flex-1">
                {/* LOGIN BUTTON */}

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handlePress("login")}
                    className="flex-1 justify-center items-center z-10"
                >
                    <Text
                        className={`text-base font-bold ${
                            activeTab === "login"
                                ? "text-dark-text_main dark:text-light-text_main"
                                : "text-dark-text_sub dark:text-light-text_sub"
                        }`}
                    >
                        Login
                    </Text>
                </TouchableOpacity>

                {/* SIGN UP BUTTON */}

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handlePress("register")}
                    className="flex-1 justify-center items-center z-10"
                >
                    <Text
                        className={`text-base font-bold ${
                            activeTab === "register"
                                ? "text-dark-text_main dark:text-light-text_main"
                                : "text-dark-text_sub dark:text-light-text_sub"
                        }`}
                    >
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CustomToggle;
