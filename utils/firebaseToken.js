import auth from "@react-native-firebase/auth";
import messaging from "@react-native-firebase/messaging";

export const getAuthToken = async () => {
    const user = auth().currentUser;
    try {
        if (user) {
            return user.getIdToken();
        }
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
