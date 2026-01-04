import { Alert, StyleSheet, Text, View } from "react-native";
import "./global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import Login from "./(auth)/login";
import { PermissionsAndroid } from "react-native";
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
// import notifee from "@notifee/react-native";

export default function Page() {
    // const notification = async ({ remoteMessage }) => {
    //     // Create a channel (required for Android)
    //     const channelId = await notifee.createChannel({
    //         id: "default",
    //         name: "Default Channel",
    //     });

    //     // Display a notification
    //     await notifee.displayNotification({
    //         title: remoteMessage.notification.title,
    //         body: remoteMessage.notification.body,
    //         android: {
    //             channelId,
    //             smallIcon: "name-of-a-small-icon", // optional, defaults to 'ic_launcher'.
    //             // pressAction is needed if you want the notification to open the app when pressed
    //             pressAction: {
    //                 id: "default",
    //             },
    //         },
    //     });
    // };

    useEffect(() => {
        async function requestNotificationPermission() {
            // 1. expo-notifications handles the OS version check automatically
            const { status } = await Notifications.requestPermissionsAsync();

            if (status === "granted") {
                Alert.alert("Notification permission granted");
                getToken();
            } else {
                Alert.alert("Notification permission denied");
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
            // notification({ remoteMessage });
        });

        return unsubscribe;
    }, []);

    const getToken = async () => {
        const token = await messaging().getToken();
        console.log(token);
    };

    return (
        <SafeAreaView>
            <Text className="text-green-400 text-3xl">Hello World</Text>
            <Text>This is the first page of your app.</Text>
            <Login />
        </SafeAreaView>
    );
}
