import { SafeAreaView } from "react-native-safe-area-context";

import GoogleSignIn from "../../components/googleSignIn.jsx";
import GuestSignIn from "../../components/guestSignIn.jsx";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Pressable, Text, TextInput, View } from "react-native";
import { useColorScheme } from "nativewind";
import Animated from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";
import CustomToggle from "../../components/customToggle.jsx";
import ForgotPasswordModal from "../../components/forgetPassword.jsx";
import LoadingScreen from "../../components/loadingScreen.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState("");
    const { colorScheme } = useColorScheme();
    const [forgetPasswordModalVisible, setForgetPasswordModalVisible] =
        useState(false);

    const [page, setPage] = useState("login");

    const handleToggle = (mode) => {
        setPage(mode);
    };

    const { loginWithEmail, registerWithEmail, initializing } = useAuth();

    const handleSubmitLogin = () => {
        if (!email || !password) return;
        loginWithEmail(email, password);
    };
    const handleSubmitRegister = () => {
        if (!email || !password) return;
        registerWithEmail(email, password, user);
    };
    if (initializing) return <LoadingScreen message="Signing In..." />;

    return (
        <SafeAreaView className="flex-1 bg-light-primary dark:bg-dark-primary items-center">
            <Animated.View className="h-[20%] w-full rounded-bl-xl">
                <FontAwesome
                    name="codepen"
                    size={80}
                    color={colorScheme != "dark" ? "#4F46E5" : "#818CF8"}
                    className="self-center mt-8"
                />
            </Animated.View>
            <Animated.View
                sharedTransitionTag="customToggle"
                className="bg-light-surface dark:bg-dark-surface w-full items-center justify-center relative rounded-tr-[4rem]"
            >
                <View className="absolute bottom-[100%] left-0 h-[4rem] w-[4rem] bg-light-surface dark:bg-dark-surface z-10">
                    <View className="h-[4rem] w-[4rem] bg-light-primary dark:bg-dark-primary z-10 rounded-bl-full "></View>
                </View>
                <CustomToggle activeTabProp={"login"} onToggle={handleToggle} />
            </Animated.View>
            {page === "login" && (
                <View className="w-full bg-light-surface dark:bg-dark-surface h-[65%] rounded-b-[4rem] relative items-center pt-4">
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        className="text-left pl-4 border-b-2 border-light-border_color dark:border-dark-border_color rounded-lg w-[70%] text-light-text_main dark:text-dark-text_main text-2xl placeholder:text-light-text_sub dark:placeholder:text-dark-text_sub"
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        className="text-left pl-4 border-b-2 border-light-border_color dark:border-dark-border_color rounded-lg w-[70%] text-light-text_main dark:text-dark-text_main text-2xl placeholder:text-light-text_sub dark:placeholder:text-dark-text_sub"
                    />
                    <Pressable
                        onPress={() => setForgetPasswordModalVisible(true)}
                        className="self-end mr-[15%] mt-3 border-2 bg-light-text_sub dark:bg-dark-text_sub border-light-border_color dark:border-dark-border_color rounded-lg items-center p-1"
                    >
                        <Text className="text-light-text_main dark:text-dark-text_main text-md text-right">
                            Forgot Password?
                        </Text>
                    </Pressable>

                    <ForgotPasswordModal
                        isVisible={forgetPasswordModalVisible}
                        onClose={() => setForgetPasswordModalVisible(false)}
                    />
                    <Pressable
                        onPress={handleSubmitLogin}
                        className="items-center justify-center bg-light-text_sub dark:bg-dark-text_sub w-[70%] h-[3.5rem] rounded-2xl border-2 border-light-border_color dark:border-dark-border_color p-1 mt-48"
                        style={{ elevation: 2 }}
                    >
                        <Text className="text-light-text_main dark:text-dark-text_main text-xl font-bold">
                            Login
                        </Text>
                    </Pressable>

                    {/* <Link href="/(auth)/register" className="m-4">
                    Go to Register
                </Link> */}
                    <View className="flex-row w-[70%] justify-between items-center">
                        <GoogleSignIn text="Google" page="login" />
                        <GuestSignIn />
                    </View>
                </View>
            )}
            {page === "register" && (
                <View className="w-full bg-light-surface dark:bg-dark-surface h-[65%] rounded-b-[4rem] relative items-center pt-4">
                    <TextInput
                        placeholder="UserName"
                        value={user}
                        onChangeText={setUser}
                        autoCapitalize="none"
                        // keyboardType="email-address"
                        className="text-left pl-4 border-b-2 border-light-border_color dark:border-dark-border_color rounded-lg w-[70%] text-light-text_main dark:text-dark-text_main text-2xl placeholder:text-light-text_sub dark:placeholder:text-dark-text_sub"
                    />
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        className="text-left pl-4 border-b-2 border-light-border_color dark:border-dark-border_color rounded-lg w-[70%] text-light-text_main dark:text-dark-text_main text-2xl placeholder:text-light-text_sub dark:placeholder:text-dark-text_sub"
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        className="text-left pl-4 border-b-2 border-light-border_color dark:border-dark-border_color rounded-lg w-[70%] text-light-text_main dark:text-dark-text_main text-2xl placeholder:text-light-text_sub dark:placeholder:text-dark-text_sub"
                    />

                    <Pressable
                        onPress={handleSubmitRegister}
                        className="items-center justify-center bg-light-text_sub dark:bg-dark-text_sub w-[70%] h-[3.5rem] rounded-2xl border-2 border-light-border_color dark:border-dark-border_color p-1 mt-48"
                        style={{ elevation: 2 }}
                    >
                        <Text className="text-light-text_main dark:text-dark-text_main text-xl font-bold">
                            Register
                        </Text>
                    </Pressable>

                    <GoogleSignIn text="Sign-up with Google" page="register" />
                </View>
            )}
        </SafeAreaView>
    );
};

export default Login;
