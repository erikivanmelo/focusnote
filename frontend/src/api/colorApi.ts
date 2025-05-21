import { httpClient } from "./httpClient";

export interface RawColor {
   id  : number;
   name: string;
}

const colorApi = {
    getAll: async (): Promise<RawColor[]> => {
        return await httpClient.get<RawColor[]>("/colors/");
    },
};

export default colorApi;
