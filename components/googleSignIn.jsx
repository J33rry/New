import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import {
    GoogleSigninButton,
    GoogleSignin,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext.jsx";
import { SafeAreaView } from "react-native-safe-area-context";
GoogleSignin.configure({
    webClientId:
        "771457794896-h13mi5o8l9la6jk7l7u7vronb07ohi6a.apps.googleusercontent.com",
});

const GoogleSignIn = () => {
    const router = useRouter();
    const { user, initializing } = useAuth();

    useEffect(() => {
        if (user) {
            router.replace("/(dashboard)/home");
        }
    }, [user, router]);

    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });
            const signInResult = await GoogleSignin.signIn();

            const idToken = signInResult.data?.idToken || signInResult.idToken;
            if (!idToken) throw new Error("No ID token found");

            const googleCredential =
                auth.GoogleAuthProvider.credential(idToken);

            await auth().signInWithCredential(googleCredential);
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    if (initializing) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <SafeAreaView className="justify-center items-center rounded-xl">
            <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={signInWithGoogle}
                style={{ borderRadius: 10 }}
            />
        </SafeAreaView>
    );
};

export default GoogleSignIn;
