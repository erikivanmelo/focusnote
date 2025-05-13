import axiosInstance from "./axiosInstance";

export const httpClient = {

    get: async <T>(url: string): Promise<T> => {
        const response = await axiosInstance.get<T>(url);
        return response.data;
    },

    post: async <T>(url: string, data: unknown): Promise<T> => {
        const response = await axiosInstance.post<T>(url, data);
        return response.data;
    },

    put: async <T>(url: string, data: unknown): Promise<T> => {
        const response = await axiosInstance.put<T>(url, data);
        return response.data;
    },

    delete: async (url: string): Promise<void> => {
        await axiosInstance.delete(url);
    },
};
