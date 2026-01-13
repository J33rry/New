import { Text, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useColorScheme } from "nativewind";

const GuestSignIn = () => {
    const { guestSignIn } = useAuth();
    const { colorScheme } = useColorScheme();
    return (
        <Pressable
            onPress={guestSignIn}
            className="flex-row items-center justify-center  bg-light-text_sub dark:bg-dark-text_sub w-[49%] h-[3.5rem] rounded-2xl mt-4 border-2 border-light-border_color dark:border-dark-border_color p-1 py-3 px-4 shadow-sm active:bg-gray-100"
            style={{ elevation: 2 }}
        >
            <FontAwesome
                name="user"
                size={24}
                color={colorScheme == "dark" ? "#F1F5F9" : "#1E293B"}
                className="mr-2 text-light-surface dark:text-light-surface"
            />
            <Text className="text-light-text_main dark:text-dark-text_main font-bold text-base">
                Guest
            </Text>
        </Pressable>
    );
};

export default GuestSignIn;
