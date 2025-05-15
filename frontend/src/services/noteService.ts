import noteApi from "../api/noteApi";
import Note from "../models/Note";

const noteService = {
    getAll: async (): Promise<Note[]> => {
        const rawNotes = await noteApi.getAll();
        return rawNotes.map((rawNote) => new Note(rawNote));
    }
};

export default noteService;
