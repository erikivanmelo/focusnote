import { httpClient } from "./httpClient";
import { RawNote } from "../models/Note"

const noteApi = {
    getAll: async (): Promise<RawNote[]> => {
        return await httpClient.get<RawNote[]>("/notes/");
    },
};

export default noteApi;
