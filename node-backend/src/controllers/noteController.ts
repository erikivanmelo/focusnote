import Database from 'better-sqlite3';
const db = new Database('./data/focusnote.db');

export interface RawNote {
	id			 : number;
	title		 : string;
	content		 : string;
	created_at	 : string;
	updated_at	 : string;
    color_id     : number;
};

const noteController = {
	getAll: (): RawNote[] => {
		const query = db.prepare(`
			SELECT * FROM notes
			ORDER BY created_at DESC
		`);
		return query.all() as RawNote[];
	},

	getOne: (id: number): RawNote => {
		const query = db.prepare(`
			SELECT * FROM notes WHERE id = ?
		`);
		return query.get(id) as RawNote;
	},

	create: (
        title   : string | null, 
        content : string, 
        color_id: number
    ): number | bigint => {
		const query = db.prepare(`
			INSERT INTO notes (title, content, color_id)
			VALUES (?, ?, ?)
		`);
		const result = query.run(title, content, color_id);
        return result.lastInsertRowid;
	},

	update: (
        id: number, 
        title: string, 
        content: string, 
        color_id: number
    ): void => {
		const query = db.prepare(`
			UPDATE notes
			SET title = ?,
					content = ?,
					color_id = ?,
					updated_at = CURRENT_TIMESTAMP
			WHERE id = ?
		`);
		query.run(title, content, color_id, id);
	},

	delete: (id: number): void => {
		const query = db.prepare(`
			DELETE FROM notes WHERE id = ?
		`);
		query.run(id);
	},

	addTags: (tags: string[], noteId: number | bigint): void => {
        const query = db.prepare(`
            INSERT OR IGNORE INTO note_tags (note_id, tag_id)
            SELECT ?, id FROM tags WHERE name IN (${tags.map(() => '?').join(',')})
        `);
        const params = [noteId, ...tags];
        query.run(params);
	},

	removeAllTags: (noteId: number): void => {
		const query = db.prepare(`
            DELETE FROM note_tags 
            WHERE note_id = ?
		`);
		query.run(noteId);
	},
};

export default noteController;
