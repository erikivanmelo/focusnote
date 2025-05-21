import { httpClient } from "./httpClient";
import {RawColor} from "./colorApi";
import {RawTag} from "./tagApi";

export interface RawNote {
	id           : number;
	title        : string;
	content      : string;
	created_at   : string;
	updated_at   : string;
	color        : number;
	color_details: RawColor;
	tags_details : Array<RawTag>;
};

const noteApi = {

    getAll: async (): Promise<RawNote[]> => {
        return await httpClient.get<RawNote[]>("/notes/");
    },

    create: async (note: {
        title   : string | null;
        content : string;
        color   : number;
        tags    : Array<string>; 
    }): Promise<RawNote> => {
        const response = await httpClient.post<RawNote>("/notes/", note);
        return response;
    },

    update: async (note: {
        id      : number;
        title  ?: string;
        content?: string;
        color  ?: number;
        tags   ?: Array<string>; 
    }): Promise<RawNote> => {
        const response = await httpClient.put<RawNote>("/notes/", note);
        return response;
    },


    remove: async (id: number): Promise<void> => {
        return await httpClient.delete(`/notes/${id}/`);
    },
};

export default noteApi;

