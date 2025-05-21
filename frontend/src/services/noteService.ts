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

    create: async (note: Note): Promise<Note> => {
        const data = {
            title  : note.title,
            content: note.content,
            color  : note.color.id,
            tags   : note.tags?.map(tag => tag.name) ?? []
        };

        const createdRaw = await noteApi.create(data);
        return fromRawToNote(createdRaw);
    },

    update: async (note: Note): Promise<Note> => {
        const data = {
            id     : note.id,
            title  : note.title,
            content: note.content,
            color  : note.color.id,
            tags   : note.tags?.map(tag => tag.name) ?? []
        };

        const updatedRaw = await noteApi.update(data);
        return fromRawToNote(updatedRaw);
    },

    delete: async (id: number): Promise<void> => {
        await noteApi.remove(id);
    }
};

export default noteService;
