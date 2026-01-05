import { createContext, useContext, useState } from "react";
import { leetcodeAPI } from "../services/api";

const ProblemContext = createContext();

export const ProblemProvider = ({ children }) => {
    const [daily, setDaily] = useState(null); // Init as null to check if loaded
    const [loading, setLoading] = useState(false); // <--- Add Loading State

    const getDailyProblem = async () => {
        try {
            setLoading(true);
            const response = await leetcodeAPI.dailyProblem();
            // console.log("Fetched Daily:", response.data);
            setDaily(response.data);
        } catch (error) {
            console.error("Failed to fetch daily problem", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProblemContext.Provider
            value={{
                daily, // <--- PASS THIS!
                loading, // <--- PASS THIS!
                getDailyProblem,
            }}
        >
            {children}
        </ProblemContext.Provider>
    );
};

export const useProblem = () => useContext(ProblemContext);
