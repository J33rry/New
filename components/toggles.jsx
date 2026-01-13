import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";

const ToggleSwitch = ({ onToggle, initialValue = true }) => {
    // 1. State is now a simple boolean
    const [isOn, setIsOn] = useState(initialValue);

    // Dimensions
    const SWITCH_WIDTH = 300;
    const SWITCH_HEIGHT = 50;
    const TAB_WIDTH = SWITCH_WIDTH / 2;

    // 2. Animation Logic:
    // If ON (true) -> Translate 0 (Left)
    // If OFF (false) -> Translate TAB_WIDTH (Right)
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withSpring(isOn ? 0 : TAB_WIDTH, {
                        damping: 15,
                        stiffness: 120,
                    }),
                },
            ],
        };
    });

    const handlePress = (value) => {
        if (isOn !== value) {
            setIsOn(value);
            if (onToggle) onToggle(value); // Returns true or false
        }
    };

    return (
        <View
            className="bg-light-primary dark:bg-dark-primary rounded-full overflow-hidden flex-row relative border-2 border-light-border_color dark:border-dark-border_color"
            style={{ width: SWITCH_WIDTH, height: SWITCH_HEIGHT }}
        >
            {/* The Moving Background Pill */}
            <Animated.View
                className="absolute top-0 bottom-0 left-0 bg-light-text_sub dark:bg-dark-text_sub rounded-full m-1 shadow-sm"
                style={[{ width: TAB_WIDTH - 8 }, animatedStyle]}
            />

            {/* BUTTON: ON (Left - True) */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => handlePress(true)}
                className="flex-1 justify-center items-center z-10"
            >
                <Text
                    className={`text-base font-bold ${
                        isOn
                            ? "text-dark-text_main dark:text-light-text_main"
                            : "text-dark-text_sub dark:text-light-text_sub" // Inactive (Blend with background)
                    }`}
                >
                    ON
                </Text>
            </TouchableOpacity>

            {/* BUTTON: OFF (Right - False) */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => handlePress(false)}
                className="flex-1 justify-center items-center z-10"
            >
                <Text
                    className={`text-base font-bold ${
                        !isOn
                            ? "text-dark-text_main dark:text-light-text_main"
                            : "text-dark-text_sub dark:text-light-text_sub" // Inactive
                    }`}
                >
                    OFF
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ToggleSwitch;
