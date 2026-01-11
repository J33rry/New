import { Tabs, Redirect } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "../../context/AuthContext.jsx";
import MultiToggleSwitch from "../../components/multiSwitch.jsx";
import { SafeAreaView } from "react-native-safe-area-context";

const ProtectedTabs = () => {
    const { user, initializing } = useAuth();

    if (initializing) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false, // Hide default header
            }}
            // ✅ THIS IS THE KEY: Pass your custom component here
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            {/* Define your screens here. Order matters for the index! */}
            <Tabs.Screen name="home" />
            <Tabs.Screen name="contest" />
            <Tabs.Screen name="problems" />
            <Tabs.Screen name="codeforces" />
            <Tabs.Screen name="upcoming" />
        </Tabs>
    );
};

// Separate component to handle the logic cleanly
const CustomTabBar = ({ state, navigation }) => {
    // 1. Map your routes to icons (Order must match Tabs.Screen above)
    const routes = [
        { name: "home", icon: "home" },
        { name: "contest", icon: "code" },
        { name: "problems", icon: "list-ul" },
        { name: "codeforces", icon: "trophy" },
        { name: "upcoming", icon: "user" },
    ];

    const handleToggle = (routeName, index) => {
        const targetRoute = routes[index].name;
        navigation.navigate(targetRoute);
    };

    return (
        <SafeAreaView className="absolute bottom-2 left-0 right-0 items-center z-10 bg-transparent">
            <MultiToggleSwitch
                tabs={routes.map((r) => r.icon)}
                initialIndex={state.index}
                onToggle={handleToggle}
            />
        </SafeAreaView>
    );
};

export default function Layout() {
    return <ProtectedTabs />;
}
