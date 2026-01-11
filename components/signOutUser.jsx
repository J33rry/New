import { Text, Pressable } from "react-native";

import { useAuth } from "../context/AuthContext";

const UserSignOut = ({ is_guest }) => {
    const { signOutUser } = useAuth();

    return (
        <Pressable
            onPress={signOutUser}
            className={`items-center justify-center bg-dark-surface dark:bg-light-surface ${
                is_guest ? "w-[49%]" : "w-[70%]"
            }  h-[3.5rem] rounded-2xl border-2 border-light-border_color dark:border-dark-border_color p-1 mt-4`}
            style={{ elevation: 2 }}
        >
            <Text className="text-dark-text_main dark:text-light-text_main text-xl font-bold">
                Sign Out
            </Text>
        </Pressable>
    );
};

export default UserSignOut;
