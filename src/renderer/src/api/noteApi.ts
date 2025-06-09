import { RawColor } from "./colorApi";
import { RawTag } from "./tagApi";

export interface RawNote {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  color_details: RawColor;
  tags_details: RawTag[];
}

interface NoteInput {
  title: string;
  content: string;
  color_id: number;
  tags?: string[];
}

interface NoteUpdate extends Partial<NoteInput> {
  id: number;
}

const noteApi = {
  getAll: ()              : Promise<RawNote[]> => window.api.getAllNotes(),
  getOne: (id: number): Promise<RawNote | null> => window.api.getNote(id),
  create: (note: NoteInput): Promise<RawNote | null> => window.api.createNote(note),
  update: (note: NoteUpdate): Promise<RawNote | null> => window.api.updateNote(note.id, note),
  remove: (id: number): Promise<boolean> => window.api.deleteNote(id)
};

export default noteApi;

