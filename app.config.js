export default {
    expo: {
        scheme: "cozer",
        name: "Cozer",
        slug: "cozer",
        userInterfaceStyle: "automatic",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/sddsdd.png",
        newArchEnabled: true,
        splash: {
            image: "./assets/sddsdd.png",
            resizeMode: "contain",
            backgroundColor: "#0B1222",
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.cozer",
            googleServicesFile: "./GoogleService-Info.plist",
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/sddsdd.png",
                backgroundColor: "#ffffff",
            },
            edgeToEdgeEnabled: true,
            permissions: ["android.permission.POST_NOTIFICATIONS"],
            package: "com.cozer",
            googleServicesFile:
                process.env.GOOGLE_SERVICES_JSON_PATH ||
                "./google-services.json",
        },
        web: {
            favicon: "./assets/favicon.png",
            bundler: "metro",
        },
        plugins: [
            "expo-router",
            "@react-native-firebase/app",
            "@react-native-firebase/auth",
            "@react-native-google-signin/google-signin",
            [
                "expo-build-properties",
                {
                    ios: {
                        useFrameworks: "static",
                    },
                },
            ],
        ],
        extra: {
            router: {},
            eas: {
                projectId: "c5141b65-2095-413d-a9d8-302f82e45220",
            },
        },
    },
};
