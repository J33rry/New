import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

const AuthContext = createContext({ user: null, initializing: true });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    // google sign-in function
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
    // Google sign-out function
    const signOutUser = async () => {
        if (user && user.isAnonymous) {
            Alert.alert(
                "Wait!",
                "You are currently a Guest. If you log out now, you will lose all your data permanently.\n\nPlease link your account to Google/Apple first to save it.",
                [
                    { text: "Cancel", style: "cancel" }, // Stop them
                    {
                        text: "Log Out Anyway",
                        style: "destructive",
                        onPress: async () => {
                            await auth().signOut();
                        },
                    },
                ]
            );
        } else {
            try {
                await GoogleSignin.signOut();
                await auth().signOut();
            } catch (e) {
                console.error(e);
            }
        }
    };

    // Guest Sign in
    const guestSignIn = async () => {
        try {
            await auth().signInAnonymously();
        } catch (error) {
            console.error("Guest Sign-In Error:", error);
        }
    };

    // Guest Link Account
    const linkGoogleAccount = async () => {
        try {
            if (!user) throw new Error("No user to link");

            await GoogleSignin.hasPlayServices();
            const { data } = await GoogleSignin.signIn();
            const idToken = data?.idToken;
            const credential = auth.GoogleAuthProvider.credential(idToken);

            const userCredential = await user.linkWithCredential(credential);

            setUser(userCredential.user);

            console.log("Successfully linked to Google!");
            return { success: true };
        } catch (error) {
            if (error.code === "auth/credential-already-in-use") {
                Alert.alert(
                    "Linking Error",
                    "This Google account is already linked with another user."
                );
                return { success: false, error: "credential-already-in-use" };
            }
        }
    };

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((u) => {
            setUser(u);
            setInitializing(false);
        });
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                initializing,
                signInWithGoogle,
                signOutUser,
                guestSignIn,
                linkGoogleAccount,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
