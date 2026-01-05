import { useEffect } from "react";
import { View, ActivityIndicator, Pressable, Image, Text } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext.jsx";
import { SafeAreaView } from "react-native-safe-area-context";
// import { signInWithGoogle } from "../context/AuthContext.jsx";

GoogleSignin.configure({
    webClientId:
        "771457794896-h13mi5o8l9la6jk7l7u7vronb07ohi6a.apps.googleusercontent.com",
});

const GoogleSignIn = ({ text }) => {
    const router = useRouter();
    const { user, initializing, signInWithGoogle } = useAuth();

    useEffect(() => {
        if (user) {
            router.replace("/(dashboard)/home");
        }
    }, [user, router]);

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
        <Pressable
            onPress={signInWithGoogle}
            className="flex-row items-center justify-center bg-white border border-gray-300 rounded-lg py-3 px-4 shadow-sm active:bg-gray-100 w-48"
            style={{ elevation: 2 }}
        >
            <Image
                source={require("../assets/googleIcon.png")}
                className="size-7 mr-2"
            />
            <Text className="text-gray-700 font-bold text-base">{text}</Text>
        </Pressable>
    );
};

export default GoogleSignIn;
