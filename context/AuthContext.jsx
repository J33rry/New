import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";

const AuthContext = createContext({ user: null, initializing: true });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((u) => {
            setUser(u);
            setInitializing(false);
        });
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, initializing }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
