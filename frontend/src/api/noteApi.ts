import { httpClient } from "./httpClient";

const noteApi = {

    getAll: async (): Promise<any[]> => {
        return await httpClient.get<any[]>("/notes/");
    },
};

export default noteApi;
