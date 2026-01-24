import axios from "axios";
import { getAuthToken } from "../utils/firebaseToken";

const URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const api = axios.create({
    baseURL: URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        try {
            const token = await getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                delete config.headers.Authorization;
            }
        } catch (error) {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(
                `API Error: ${error.response.status} - ${error.response.data}`,
            );
        } else {
            console.error(`API Error: ${error.message}`);
        }
        return Promise.reject(error);
    },
);

// Auth API
export const authAPI = {
    authSync: (data) => api.post("/auth/sync", data),
    getProfile: () => api.get("/auth/profile"),
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

export const contestAPI = {
    upcomingContests: () => api.get("/contests/"),
};

export default api;
