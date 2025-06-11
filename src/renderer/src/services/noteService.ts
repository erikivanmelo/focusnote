import noteApi, {RawNote} from "../api/noteApi";
import Note from "../models/Note";

import {fromRawToColor} from "./colorService";
import {fromRawsToTags} from "./tagService";

function fromRawToNote(data: RawNote): Note {
    return new Note(
        data.id ?? -1,
        data.title ?? "",
        data.content ?? "",
        fromRawToColor(data.color_details),
        fromRawsToTags(data.tags_details),
        new Date(data.created_at),
        new Date(data.updated_at)
    );
}

const noteService = {
    getAll: async (): Promise<Note[]> => {
        const rawNotes = await noteApi.getAll();
        return rawNotes.map((rawNote) => fromRawToNote(rawNote));
    },

    getOne: async (id: number): Promise<Note | null> => {
        const rawNote = await noteApi.getOne(id);
        return rawNote? fromRawToNote(rawNote) : null;
    },

    create: async (note: Note): Promise<void> => {
        const data = {
            title   : note.title,
            content : note.content,
            color_id: note.color.id,
            tags    : note.tags?.map(tag => tag.name) ?? []
        };

        await noteApi.create(data);
    },

    update: async (note: Note): Promise<void> => {
        const data = {
            id      : note.id,
            title   : note.title,
            content : note.content,
            color_id: note.color.id,
            tags    : note.tags?.map(tag => tag.name) ?? []
        };

        await noteApi.update(data);
    },

    delete: async (id: number): Promise<void> => {
        await noteApi.remove(id);
    }
};

export default noteService;
