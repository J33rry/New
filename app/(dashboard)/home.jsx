import { useEffect, useState } from "react"; // <--- Import useEffect
import { Text, ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authAPI } from "../../services/api.js";
import Header from "../../components/header.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Home = () => {
    // const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { userDetails, setUserDetails } = useAuth();

    const getProfileData = async () => {
        setLoading(true);
        try {
            const response = await authAPI.getProfile();
            setUserDetails(response.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getProfileData();
    }, []);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-light-primary dark:bg-dark-primary">
            <Header data={userDetails} />

            <View></View>
        </SafeAreaView>
    );
};

export default Home;
