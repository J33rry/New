import { View, Text, TextInput, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import ToggleSwitch from "../../components/toggles";
import InlineTimePicker from "../../components/timePicker";
import { useRouter } from "expo-router";
import UserSignOut from "../../components/signOutUser";
import GuestLink from "../../components/guestLink";
import LoadingScreen from "../../components/loadingScreen";

const CompleteProfile = () => {
    const { userDetails, setUserDetails, initializing } = useAuth();
    const [leetcodeUser, setLeetcodeUser] = useState("");
    const [codeforcesUser, setCodeforcesUser] = useState("");
    const [userName, setUserName] = useState("");
    const { colorScheme } = useColorScheme();
    const router = useRouter();

    const userData = userDetails.profile ? userDetails.profile : userDetails;

    const [dailyNotifications, setDailyNotifications] = useState(
        userData.daily_notifications
    );
    const [contestNotifications, setContestNotifications] = useState(
        userData.contest_notifications
    );
    const [loading, setLoading] = useState(false);

    const parseTime = (timeString) => {
        const [hours, minutes] = timeString.split(":");
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        return date;
    };

    const formatTimeForBackend = (date) => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}:00`;
    };

    const [notificationTime, setNotificationTime] = useState(
        parseTime(userData.daily_time)
    );
    const getProfileData = async () => {
        setLoading(true);
        try {
            const response = await authAPI.getProfile();
            setUserDetails(response.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async () => {
        setLoading(true);
        try {
            const res = await authAPI.updateProfile({
                leetcode_user:
                    leetcodeUser === "" ? userData.leetcode_user : leetcodeUser,
                codeforces_user:
                    codeforcesUser === ""
                        ? userData.codeforces_user
                        : codeforcesUser,
                display_name:
                    userName === "" ? userData.display_name : userName,
                daily_notifications: dailyNotifications,
                contest_notifications: contestNotifications,
                daily_time: formatTimeForBackend(notificationTime),
            });
            if (res.status === 200) {
                alert("Profile updated successfully!");
                getProfileData();
                router.back();
            } else {
                alert("Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating the profile.");
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <LoadingScreen message="Updating your profile..." />;
    }
    if (initializing) {
        return <LoadingScreen message="Signing Out..." />;
    }

    return (
        <SafeAreaView className="flex-1 justify-center items-center gap-4 bg-light-primary dark:bg-dark-primary">
            <FontAwesome
                name="id-card"
                size={80}
                color={colorScheme != "dark" ? "#4F46E5" : "#818CF8"}
                className="self-center mb-2"
            />
            <View className="w-full h-[85%] items-center bg-light-surface dark:bg-dark-surface rounded-[4rem] rounded-tl-none relative">
                <View className="absolute bottom-[100%] left-0 h-[4rem] w-[4rem] bg-light-surface dark:bg-dark-surface z-10">
                    <View className="h-[4rem] w-[4rem] bg-light-primary dark:bg-dark-primary z-10 rounded-bl-full "></View>
                </View>
                <View className="w-full items-center relative mt-8">
                    <TextInput
                        placeholder={userData.leetcode_user}
                        value={leetcodeUser}
                        onChangeText={setLeetcodeUser}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        className="text-left pl-4 border-b-2 border-light-border_color dark:border-dark-border_color rounded-lg w-[70%] text-light-text_main dark:text-dark-text_main text-2xl placeholder:text-light-text_sub dark:placeholder:text-dark-text_sub"
                    />
                    <Image
                        source={require("../../assets/leetcode.png")}
                        className="size-10 absolute top-1/2 right-0 -translate-y-1/2 -translate-x-[200%]"
                    />
                </View>
                <View className="w-full items-center relative">
                    <TextInput
                        placeholder={userData.codeforces_user}
                        value={codeforcesUser}
                        onChangeText={setCodeforcesUser}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        className="text-left pl-4 border-b-2 border-light-border_color dark:border-dark-border_color rounded-lg w-[70%] text-light-text_main dark:text-dark-text_main text-2xl placeholder:text-light-text_sub dark:placeholder:text-dark-text_sub"
                    />
                    <Image
                        source={require("../../assets/codeforces.png")}
                        className="size-10 absolute top-1/2 right-0 -translate-y-1/2 -translate-x-[200%]"
                    />
                </View>
                <View className="w-full items-center relative">
                    <TextInput
                        placeholder={userData.display_name}
                        value={userName}
                        onChangeText={setUserName}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        className="text-left pl-4 border-b-2 border-light-border_color dark:border-dark-border_color rounded-lg w-[70%] text-light-text_main dark:text-dark-text_main text-2xl placeholder:text-light-text_sub dark:placeholder:text-dark-text_sub"
                    />
                    <FontAwesome
                        name="user"
                        size={36}
                        color="#9CA3AF"
                        className="absolute top-1/2 right-0 -translate-y-1/2 -translate-x-[250%]"
                    />
                </View>
                <View>
                    <Text className="text-light-text_sub dark:text-dark-text_sub text-lg font-bold mt-4">
                        Contest Notifications
                    </Text>
                    <ToggleSwitch
                        onToggle={(value) => setContestNotifications(value)}
                    />
                    <Text className="text-light-text_sub dark:text-dark-text_sub text-lg font-bold mt-4">
                        Daily Notifications
                    </Text>
                    <ToggleSwitch
                        onToggle={(value) => setDailyNotifications(value)}
                    />
                    <InlineTimePicker
                        time={notificationTime}
                        onChange={setNotificationTime}
                    />
                </View>

                <Pressable
                    onPress={onSubmit}
                    className="items-center justify-center bg-light-text_sub dark:bg-dark-text_sub w-[70%] h-[3.5rem] rounded-2xl border-2 border-light-border_color dark:border-dark-border_color p-1 mt-1"
                    style={{ elevation: 2 }}
                >
                    <Text className="text-dark-text_main dark:text-light-text_main text-xl font-bold">
                        Submit
                    </Text>
                </Pressable>
                {userData.is_guest ? (
                    <View className="flex-row w-[70%] gap-1">
                        <GuestLink userData={userData} />
                        <UserSignOut is_guest={userData.is_guest} />
                    </View>
                ) : (
                    <UserSignOut />
                )}
            </View>
        </SafeAreaView>
    );
};

export default CompleteProfile;
