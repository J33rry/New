import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
} from "react-native";
import auth from "@react-native-firebase/auth"; // <--- CHANGED IMPORT

const ForgotPasswordModal = ({ isVisible, onClose }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'error' | 'success', text: string }

    const handleReset = async () => {
        setLoading(true);
        setStatus(null);

        try {
            await auth().sendPasswordResetEmail(email); // <--- CHANGED USAGE
            setStatus({
                type: "success",
                text: "Email sent! Please check your inbox.",
            });

            // Optional: Close modal automatically after 2 seconds
            setTimeout(() => {
                onClose();
                setStatus(null);
                setEmail("");
            }, 2500);
        } catch (error) {
            let msg = "An unexpected error occurred.";
            if (error.code === "auth/invalid-email")
                msg = "Please enter a valid email.";
            if (error.code === "auth/user-not-found")
                msg = "No account found with this email.";

            setStatus({ type: "error", text: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent>
            {/* ... (Rest of your UI code remains exactly the same) ... */}
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl p-6">
                    <Text className="text-xl font-bold mb-4">
                        Reset Password
                    </Text>

                    <TextInput
                        className="bg-slate-100 p-4 rounded-xl mb-4"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />

                    {status && (
                        <Text
                            className={`mb-4 text-center ${
                                status.type === "error"
                                    ? "text-red-500"
                                    : "text-green-600"
                            }`}
                        >
                            {status.text}
                        </Text>
                    )}

                    <TouchableOpacity
                        onPress={handleReset}
                        className="bg-blue-600 p-4 rounded-xl items-center"
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white font-bold">
                                Send Link
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        className="mt-4 items-center"
                    >
                        <Text className="text-slate-500">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ForgotPasswordModal;
