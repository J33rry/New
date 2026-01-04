import { SafeAreaView } from "react-native-safe-area-context";

import GoogleSignIn from "../../components/googleSignIn.jsx";
import { Text, TouchableOpacity } from "react-native";

const Login = () => {
    return (
        <SafeAreaView className="flex-1 justify-center items-center">
            <GoogleSignIn />
            <TouchableOpacity className="mb-4">
                <Text>Continue as Guest</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Login;
