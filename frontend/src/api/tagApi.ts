import { httpClient } from "./httpClient";

export interface RawTag {
   id  : number;
   name: string;
}

const tagApi = {
    getAllNames: async (): Promise<string[]> => {
        return await httpClient.get<string[]>("/tags/names/");
    },

};

export default tagApi;
