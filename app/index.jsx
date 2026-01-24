import { Alert, Linking } from "react-native";
import "./global.css";
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { Redirect } from "expo-router";


export default function Page() {
    useEffect(() => {
        async function requestNotificationPermission() {
            const { status } = await Notifications.requestPermissionsAsync();

            if (status !== "granted") {
                Linking.openSettings();
            }
        }

        requestNotificationPermission();
    }, []);
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            Alert.alert(
                "A new FCM message arrived!",
                JSON.stringify(remoteMessage)
            );
        });

        return unsubscribe;
    }, []);
    return <Redirect href="/(dashboard)/home" />;
}
