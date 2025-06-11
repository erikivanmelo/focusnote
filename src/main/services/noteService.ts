import noteController, {RawNote} from '../controllers/noteController';
import colorService, {Color} from './colorService';
import tagService, {Tag} from './tagService';

export interface Note {
	id			 : number;
	title		 : string;
	content		 : string;
	created_at	 : string;
	updated_at	 : string;
	color_details: Color;
	tags_details : Array<Tag>;
}

export interface CreateNoteParams {
	title: string | null;
	content: string;
	color_id: number;
	tags: string[];
}

export interface UpdateNoteParams {
	id: number;
	title: string;
	content: string;
	color_id: number;
	tags: string[];
}

export interface DeleteNoteParams {
	id: number;
}

export interface GetOneNoteParams {
	id: number;
}

function fromRawToNote(note: RawNote): Note {
    return {
        id: note.id,
        title: note.title,
        content: note.content,
        created_at: note.created_at,
        updated_at: note.updated_at,
        color_details: colorService.getOne({ id: note.color_id }),
        tags_details : tagService.getAllByNote({ noteId: note.id })
    };
}

const noteService = {
	getAll: (): Note[] => {
		const rawNotes: RawNote[] = noteController.getAll();
        return rawNotes.map(
            (note) => fromRawToNote(note)
        ) as Note[];
	},

	getOne: (params: GetOneNoteParams): Note => {
		const rawNote = noteController.getOne(params.id);
		return fromRawToNote(rawNote);
	},

	create: (params: CreateNoteParams): void => {
		const noteId = noteController.create(params.title, params.content, params.color_id);
		if (params.tags.length > 0) {
			tagService.createOrIgnore({ names: params.tags });
			noteController.addTags(params.tags, noteId);
		}
	},

	update: (params: UpdateNoteParams): void => {
        noteController.update(
            params.id,
            params.title,
            params.content,
            params.color_id
        );

        noteController.removeAllTags(params.id);
        if (params.tags && Array.isArray(params.tags)) {
            tagService.createOrIgnore({ names: params.tags });
            noteController.addTags(params.tags, params.id);
        }
	},

	delete: (params: DeleteNoteParams): void => {
        noteController.removeAllTags(params.id);
		noteController.delete(params.id);
	},

};

export default noteService;
