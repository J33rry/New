import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import { authAPI } from "../services/api";
import { getMessagingToken } from "../utils/firebaseToken";

const AuthContext = createContext({ user: null, initializing: true });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const [userDetails, setUserDetails] = useState(null);

    // Sync user to backend whenever user changes
    const syncUserToBackend = async (currentUser) => {
        try {
            setInitializing(true);
            if (!currentUser) return;

            // 1. Get the Push Notification Token (Address)
            let fcmToken = await getMessagingToken();
            if (!fcmToken) {
                console.warn("No FCM token available for push notifications.");
                fcmToken = null; // Proceed without it
            }
            console.log(currentUser);

            // 2. Call your Backend
            const response = await authAPI.authSync({
                pushToken: fcmToken,
                isAnonymous: currentUser.isAnonymous,
            });
            console.log(
                "✅ Backend Sync Success. Postgres ID:",
                response.data.userId,
            );
            setInitializing(false);
        } catch (error) {
            console.error("❌ Backend Sync Failed:", error);
        }
    };

    // Register with Email function
    const registerWithEmail = async (email, password, name) => {
        setInitializing(true);
        try {
            await auth().createUserWithEmailAndPassword(email, password);
            await auth().currentUser.updateProfile({ displayName: name });
            await syncUserToBackend(auth().currentUser);
            setInitializing(false);
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                throw new Error("That email address is already in use!");
            }
            if (error.code === "auth/invalid-email") {
                throw new Error("That email address is invalid!");
            }
            throw error;
        }
    };

    // Email Sign-in function
    const loginWithEmail = async (email, password) => {
        setInitializing(true);
        try {
            await auth().signInWithEmailAndPassword(email, password);
            setInitializing(false);
        } catch (error) {
            if (
                error.code === "auth/user-not-found" ||
                error.code === "auth/wrong-password"
            ) {
                throw new Error("Invalid email or password");
            }
            throw error;
        }
    };

    // google sign-in function
    const signInWithGoogle = async () => {
        setInitializing(true);
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
            setInitializing(false);
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };
    // Google sign-out function
    const signOutUser = async () => {
        setInitializing(true);
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
                ],
            );
        } else {
            try {
                await GoogleSignin.signOut();
                await auth().signOut();
            } catch (e) {
                console.error(e);
            }
        }
        setInitializing(false);
    };

    // Guest Sign in
    const guestSignIn = async () => {
        setInitializing(true);
        try {
            await auth().signInAnonymously();
        } catch (error) {
            console.error("Guest Sign-In Error:", error);
        }
        setInitializing(false);
    };

    // Guest Link Account
    const linkGoogleAccount = async () => {
        setInitializing(true);
        try {
            if (!user) throw new Error("No user to link");

            await GoogleSignin.hasPlayServices();
            const { data } = await GoogleSignin.signIn();
            const idToken = data?.idToken;
            const credential = auth.GoogleAuthProvider.credential(idToken);

            const userCredential = await user.linkWithCredential(credential);

            setUser(userCredential.user);

            console.log("Successfully linked to Google!");
            setInitializing(false);
            return { success: true };
        } catch (error) {
            if (error.code === "auth/credential-already-in-use") {
                Alert.alert(
                    "Linking Error",
                    "This Google account is already linked with another user.",
                );
                return { success: false, error: "credential-already-in-use" };
            }
        }
    };

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (u) => {
            if (u) {
                // Whenever user state changes to "Logged In", we try to sync.
                // This covers Auto-Login, Google Login, and Guest Login.
                await syncUserToBackend(u);
            }
            setUser(u);
            setInitializing(false);
        });
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                userDetails,
                initializing,
                setUserDetails,
                signInWithGoogle,
                signOutUser,
                guestSignIn,
                linkGoogleAccount,
                registerWithEmail,
                loginWithEmail,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
