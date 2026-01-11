import { Image, Pressable, Text } from "react-native";

import { useAuth } from "../context/AuthContext";

const GuestLink = () => {
    const { user, linkGoogleAccount } = useAuth();
    return (
        user.isAnonymous && (
            <Pressable
                onPress={linkGoogleAccount}
                className="items-center justify-center bg-dark-surface dark:bg-light-surface w-[49%] h-[3.5rem] rounded-2xl border-2 border-light-border_color dark:border-dark-border_color p-1 mt-4 flex-row"
                style={{ elevation: 2 }}
            >
                <Image
                    source={require("../assets/googleIcon.png")}
                    className="size-7 mr-2"
                />
                <Text className="text-dark-text_main dark:text-light-text_main text-xl font-bold">
                    Google
                </Text>
            </Pressable>
        )
    );
};

export default GuestLink;
