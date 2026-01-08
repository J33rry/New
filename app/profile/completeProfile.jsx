import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { authAPI } from "../../services/api";

const CompleteProfile = () => {
    const [leetcodeUser, setLeetcodeUser] = useState("");
    const [codeforcesUser, setCodeforcesUser] = useState("");
    const [userName, setUserName] = useState("");

    const onSubmit = async () => {
        const res = await authAPI.updateProfile({
            leetcode_user: leetcodeUser,
            codeforces_user: codeforcesUser,
            display_name: userName,
        });
        console.log(res.data);
    };

    return (
        <SafeAreaView className="flex-1 justify-center items-center gap-4 p-4">
            <Text>completeProfile</Text>
            <TextInput
                value={leetcodeUser}
                onChangeText={setLeetcodeUser}
                placeholder="Leetcode UserName"
                placeholderTextColor="#888"
            />
            <TextInput
                value={codeforcesUser}
                onChangeText={setCodeforcesUser}
                placeholder="CodeForces UserName"
                placeholderTextColor="#888"
            />
            <TextInput
                value={userName}
                onChangeText={setUserName}
                placeholder="UserName"
                placeholderTextColor="#888"
            />
            <Pressable onPress={onSubmit}>
                <Text>Submit</Text>
            </Pressable>
        </SafeAreaView>
    );
};

export default CompleteProfile;
