import { SafeAreaView } from "react-native-safe-area-context";

import GoogleSignIn from "../../components/googleSignIn.jsx";
// import { Text, TouchableOpacity, Pressable } from "react-native";
// import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import GuestSignIn from "../../components/guestSignIn.jsx";

const Login = () => {
    return (
        <SafeAreaView className="flex-1 justify-center items-center gap-4">
            <GoogleSignIn />
            <GuestSignIn />
        </SafeAreaView>
    );
};

export default Login;
