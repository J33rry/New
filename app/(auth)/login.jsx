import { SafeAreaView } from "react-native-safe-area-context";

import GoogleSignIn from "../../components/googleSignIn.jsx";
import GuestSignIn from "../../components/guestSignIn.jsx";
import EmailSignIn from "../../components/emailSignIn.jsx";

const Login = () => {
    return (
        <SafeAreaView className="flex-1 justify-center items-center gap-4">
            <EmailSignIn />
            <GoogleSignIn text="Sign in with Google" />
            <GuestSignIn />
        </SafeAreaView>
    );
};

export default Login;
