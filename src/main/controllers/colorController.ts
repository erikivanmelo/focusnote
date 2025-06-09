import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';

// Log database path for debugging
const dbPath = path.join(app.getPath('userData'), 'focusnote.db');
const db = new Database(dbPath);

export interface RawColor {
    id  : number;
    name: string;
    is_default: boolean;
 }
 
 const colorController = {
     getAll: (): RawColor[] => {
         const query = db.prepare(`
             SELECT * FROM colors
             ORDER BY id ASC
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
 