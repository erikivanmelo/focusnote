import noteApi from "../api/noteApi";
import Note from "../models/Note";

const noteService = {
    fetchAll: async (): Promise<Note[]> => {
        const notes = await noteApi.getAll();
        return Note.fromArray(notes);
    }
};

export default noteService;
