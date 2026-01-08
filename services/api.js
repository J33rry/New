import axios from "axios";
import { getAuthToken } from "../utils/firebaseToken";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
// import { updateProfile } from "@react-native-firebase/auth";

const api = axios.create({
    baseURL: "http://172.20.10.5:3001",
    // baseURL: "http://10.180.104.24:3001",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(
                `API Error: ${error.response.status} - ${error.response.data}`
            );
        } else {
            console.error(`API Error: ${error.message}`);
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    authSync: (data) => api.post("/auth/sync", data),
    getProfile: () => api.put("/auth/profile"),
    updateProfile: (data) => api.post("/auth/update", data),
};

export const leetcodeAPI = {
    dailyProblem: () => api.get("/leetcode/daily"),
    problems: ({ skip = 0, limit = 50, filters = {} }) =>
        api.post("/leetcode/problems", {
            skip,
            limit,
            filters,
        }),
    getProblemDetails: (slug) => api.get(`/leetcode/problem/${slug}`),
    userStats: (userId) =>
        api.get(`/leetcode/userStats`, { params: { userId } }),
};

export const codeforcesAPI = {
    problems: ({ skip = 0, limit = 50, filters = {} }) =>
        api.post("/codeforces/problems", {
            skip,
            limit,
            filters,
        }),
    getProblemDetails: ({ contestId, index }) =>
        api.post("/codeforces/problem", { contestId, index }),
};

export default api;
