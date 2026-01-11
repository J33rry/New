import { useColorScheme } from "nativewind";
import React from "react";
import { View, Text } from "react-native";
import DatePicker from "react-native-date-picker";

const InlineTimePicker = ({ time, onChange }) => {
    const { colorScheme } = useColorScheme();
    return (
        <View className="items-center justify-center bg-light-surface dark:bg-dark-surface text-light-text_sub dark:text-dark-text_sub">
            <DatePicker
                date={time}
                onDateChange={onChange}
                mode="time"
                modal={false}
                minuteInterval={30}
                dividerColor={colorScheme === "dark" ? "#94A3B8" : "#64748B"}
            />
        </View>
    );
};

export default InlineTimePicker;
