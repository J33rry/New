import { View, Text, Pressable } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useRouter } from "expo-router";

const Header = ({ data }) => {
    const { colorScheme } = useColorScheme();
    const router = useRouter();
    // console.log(data);
    return (
        <View className="align-top items-start justify-between w-full flex-row bg-light-surface dark:bg-dark-surface rounded-xl p-8">
            <Text className="text-light-text_main dark:text-dark-text_main text-xl">
                {data
                    ? `Welcome, ${
                          data.profile
                              ? data.profile.display_name
                              : data.display_name
                      }`
                    : "Welcome"}
            </Text>
            <Pressable onPress={() => router.push("/profile/Profile")}>
                <FontAwesome
                    name="sliders"
                    size={24}
                    color={colorScheme === "dark" ? "#F1F5F9" : "#0F172A"}
                />
            </Pressable>
        </View>
    );
};

export default Header;
