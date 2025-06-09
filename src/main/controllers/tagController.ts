import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';

const dbPath = path.join(app.getPath('userData'), 'focusnote.db');
const db = new Database(dbPath);

export interface RawTag {
   id  : number;
   name: string;
}

const tagController = {
    getAll: (): RawTag[] => {
        const query = db.prepare(`
            SELECT * FROM tags
            ORDER BY name ASC
        `);
        return query.all() as RawTag[];
    },

    getAllByNote: (noteId: number): RawTag[] => {
        const query = db.prepare(`
            SELECT t.id, t.name
            FROM tags t
            JOIN note_tags nt ON t.id = nt.tag_id
            WHERE nt.note_id = ?
            ORDER BY t.name ASC
        `);
        return query.all(noteId) as RawTag[];
    },

    getAllNames: (): string[] => {
        const query = db.prepare(`
            SELECT name FROM tags
            ORDER BY name ASC
        `);
        return query.pluck().all() as string[];
    },

    createOrIgnore: (tags: string[]): void => {
        const values: string = tags.map(() => '(?)').join(', ');
        const query = db.prepare(`INSERT OR IGNORE INTO tags (name) VALUES ${values}`);
        query.run(tags);
    },
};

export default tagController;
