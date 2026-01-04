import { View, Text, Pressable } from "react-native";
import React from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const Logout = () => {
    const signOutUser = async () => {
        try {
            await GoogleSignin.signOut();
            await auth().signOut();
            console.log("User signed out!");
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <View>
            <View style={{ alignItems: "center" }}>
                <Pressable
                    onPress={signOutUser}
                    style={{
                        backgroundColor: "red",
                        padding: 10,
                        borderRadius: 5,
                    }}
                >
                    <Text style={{ color: "white" }}>Sign Out</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Logout;
