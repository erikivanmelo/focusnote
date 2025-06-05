import Database from 'better-sqlite3';
const db = new Database('./data/focusnote.db');

export interface RawColor {
   id  : number;
   name: string;
   is_default: boolean;
}

const colorController = {
    getAll: (): RawColor[] => {
        const query = db.prepare(`
            SELECT * FROM colors
            ORDER BY name ASC
        `);
        return query.all() as RawColor[];
    },

    getOne: (id: number): RawColor => {
        const query = db.prepare(`
            SELECT * FROM colors WHERE id = ?
        `);
        return query.get(id) as RawColor;
    },
}
export default colorController;
