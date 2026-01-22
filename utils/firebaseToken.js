import auth from "@react-native-firebase/auth";
import messaging from "@react-native-firebase/messaging";

export const getAuthToken = async () => {
    try {
        const user = auth().currentUser;
        if (!user) return null;
        const token = await user.getIdToken();
        return token || null;
    } catch (error) {
        console.error("Error getting auth token:", error);
        return null;
    }
};

export const getMessagingToken = async () => {
    try {
        // 1. Request Permission (Required for iOS & Android 13+)
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            console.log("User has disabled notifications");
            return null;
        }

        // 2. Get the Token
        const fcmToken = await messaging().getToken();
        return fcmToken;
    } catch (error) {
        console.error("Error getting FCM token:", error);
        return null;
    }
};
