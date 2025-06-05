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

function fromRawToNote(note: RawNote): Note {
    return {
        id: note.id,
        title: note.title,
        content: note.content,
        created_at: note.created_at,
        updated_at: note.updated_at,
        color_details: colorService.getOne(note.color_id),
        tags_details : tagService.getAllByNote(note.id)
    };
}

const noteService = {
	getAll: (): Note[] => {
		const rawNotes: RawNote[] = noteController.getAll();
        return rawNotes.map(
            (note) => fromRawToNote(note)
        ) as Note[];
	},

	getOne: (id: number): Note => {
		const rawNote = noteController.getOne(id);
		return fromRawToNote(rawNote);
	},

	create: (
        title    : string | null, 
        content  : string, 
        color_id : number, 
        tags     : string[]
    ): void => {
		const noteId = noteController.create(title, content, color_id);
        tagService.createOrIgnore(tags);
		noteController.addTags(tags, noteId);
	},

	update: (
        id: number, 
        title: string, 
        content: string, 
        color_id: number, 
        tags: string[]
    ): void => {
        noteController.update(
            id,
            title,
            content,
            color_id
        );

        noteController.removeAllTags(id)
        noteController.addTags(tags, id);
	},

	delete: (id: number): void => {
        noteController.removeAllTags(id);
		noteController.delete(id);
	},

};

export default noteService;
