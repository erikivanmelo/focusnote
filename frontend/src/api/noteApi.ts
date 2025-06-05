import { httpClient } from "./httpClient";
import {RawColor} from "./colorApi";
import {RawTag} from "./tagApi";



export interface RawNote {
	id           : number;
	title        : string;
	content      : string;
	created_at   : string;
	updated_at   : string;
	color_details: RawColor;
	tags_details : Array<RawTag>;
};

const noteApi = {

    getAll: async (): Promise<RawNote[]> => {
        return await httpClient.get<RawNote[]>("/notes/");
    },

    getOne: async (id: number): Promise<RawNote> => {
        return await httpClient.get<RawNote>("/notes/"+id);
    },

    create: async (note: {
        title   : string;
        content : string;
        color_id: number;
        tags    : string[]; 
    }): Promise<RawNote> => {
        return await httpClient.post<RawNote>("/notes/", note);
    },

    update: async (note: {
        id       : number;
        title   ?: string;
        content ?: string;
        color_id?: number;
        tags    ?: Array<string>; 
    }): Promise<RawNote> => {
        return await httpClient.put<RawNote>("/notes/"+note.id+"/", note);
    },


    remove: async (id: number): Promise<void> => {
        return await httpClient.delete(`/notes/${id}/`);
    },
};

export default noteApi;

