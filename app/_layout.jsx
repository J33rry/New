import messaging from "@react-native-firebase/messaging";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext.jsx";

const RootLayout = () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log("Message handled in the background!", remoteMessage);
    });
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
    );
};

export default RootLayout;
