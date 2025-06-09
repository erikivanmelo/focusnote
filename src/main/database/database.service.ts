import { app } from 'electron';
import { Note, NoteCreate, NoteUpdate, Tag } from './types';
import betterSqlite3 from 'better-sqlite3';

const DB_PATH = app.getPath('userData') + '/focusnote.db';

export class DatabaseService {
    private db: betterSqlite3.Database;

    constructor() {
        this.db = betterSqlite3(DB_PATH);
        this.db.pragma('journal_mode = WAL');
        this.db.pragma('foreign_keys = ON');
        this.initializeDatabase();
    }

    private initializeDatabase() {
        // Enable foreign keys
        this.db.prepare('PRAGMA foreign_keys = ON').run();

        // Create colors table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS colors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL CHECK(length(name) <= 8),
                is_default BOOLEAN DEFAULT FALSE,
                UNIQUE(name)
            )
        `);

        // Create tags table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL CHECK(length(name) <= 40),
                UNIQUE(name)
            )
        `);

        // Create notes table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                color_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (color_id) REFERENCES colors(id)
            )
        `);

        // Create note_tags join table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS note_tags (
                note_id INTEGER,
                tag_id INTEGER,
                PRIMARY KEY (note_id, tag_id),
                FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
            )
        `);

        // Insert default colors if they don't exist
        this.initializeDefaultColors();
    }

    private initializeDefaultColors() {
        const defaultColors = [
            { name: 'light', is_default: true },
            { name: 'pink', is_default: false },
            { name: 'red', is_default: false },
            { name: 'orange', is_default: false },
            { name: 'yellow', is_default: false },
            { name: 'green', is_default: false },
            { name: 'blue', is_default: false },
            { name: 'purple', is_default: false }
        ];

        const insertColor = this.db.prepare(`
            INSERT OR IGNORE INTO colors (name, is_default)
            VALUES (?, ?)
        `);

        const transaction = this.db.transaction((colors: Array<{name: string, is_default: boolean}>) => {
            for (const color of colors) {
                insertColor.run(color.name, color.is_default ? 1 : 0);
            }
        });

        transaction(defaultColors);
    }

    // Helper method to get tags for a note
    private getNoteTags(noteId: number): Tag[] {
        interface DbTag { id: number; name: string; }
        const stmt = this.db.prepare('SELECT t.* FROM tags t JOIN note_tags nt ON t.id = nt.tag_id WHERE nt.note_id = ?');
        const result = stmt.all(noteId) as DbTag[];
        return result.map(tag => ({
            id: tag.id,
            name: tag.name
        }));
    }

    getAllNotes(): Note[] {
        interface DbNote {
            id: number;
            title: string;
            content: string;
            color_id: number;
            created_at: string;
            updated_at: string;
            color_name: string;
            is_default: number;
        }
        
        const stmt = this.db.prepare(`
            SELECT n.*, c.name as color_name, c.is_default 
            FROM notes n
            JOIN colors c ON n.color_id = c.id
            ORDER BY n.created_at DESC
        `);
        const notes = stmt.all() as DbNote[];

        return notes.map(note => ({
            id: note.id,
            title: note.title,
            content: note.content,
            color_id: note.color_id,
            created_at: note.created_at,
            updated_at: note.updated_at,
            color_details: {
                id: note.color_id,
                name: note.color_name,
                is_default: note.is_default === 1
            },
            tags_details: this.getNoteTags(note.id)
        }));
    }

    getNoteById(id: number): Note | undefined {
        interface DbNote {
            id: number;
            title: string;
            content: string;
            color_id: number;
            created_at: string;
            updated_at: string;
            color_name: string;
            is_default: number;
        }
        
        const stmt = this.db.prepare(`
            SELECT n.*, c.name as color_name, c.is_default 
            FROM notes n
            JOIN colors c ON n.color_id = c.id
            WHERE n.id = ?
        `);
        const note = stmt.get(id) as DbNote | undefined;

        if (!note) return undefined;

        return {
            id: note.id,
            title: note.title,
            content: note.content,
            color_id: note.color_id,
            created_at: note.created_at,
            updated_at: note.updated_at,
            color_details: {
                id: note.color_id,
                name: note.color_name,
                is_default: note.is_default === 1
            },
            tags_details: this.getNoteTags(note.id)
        };
    }

    createNote(note: NoteCreate): Note {
        const { title, content, color_id, tags = [] } = note;
        
        const insertNote = this.db.prepare(`
            INSERT INTO notes (title, content, color_id)
            VALUES (?, ?, ?)
        `);
        
        const insertNoteTag = this.db.prepare(`
            INSERT INTO note_tags (note_id, tag_id)
            VALUES (?, ?)
        `);
        
        const getOrCreateTag = this.db.prepare(`
            INSERT OR IGNORE INTO tags (name) VALUES (?);
            SELECT id FROM tags WHERE name = ?;
        `);
        
        const transaction = this.db.transaction(() => {
            // Insert the note
            const noteInfo = insertNote.run(title, content, color_id);
            const noteId = noteInfo.lastInsertRowid;
            
            // Process tags
            for (const tagName of tags) {
                const tag = getOrCreateTag.get(tagName, tagName);
                insertNoteTag.run(noteId, tag.id);
            }
            
            return noteId;
        });
        
        const noteId = transaction();
        return this.getNoteById(noteId) as Note;
    }

    updateNote(id: number, note: NoteUpdate): Note | undefined {
        const { title, content, color_id, tags } = note;
        
        // Start a transaction for atomic updates
        const transaction = this.db.transaction(() => {
            // Build the update query dynamically based on provided fields
            const updates: string[] = [];
            const params: any[] = [];
            
            if (title !== undefined) {
                updates.push('title = ?');
                params.push(title);
            }
            
            if (content !== undefined) {
                updates.push('content = ?');
                params.push(content);
            }
            
            if (color_id !== undefined) {
                updates.push('color_id = ?');
                params.push(color_id);
            }
            
            // Always update the updated_at timestamp
            updates.push('updated_at = CURRENT_TIMESTAMP');
            
            // Add the WHERE condition
            params.push(id);
            
            // Execute the update
            const updateQuery = `
                UPDATE notes 
                SET ${updates.join(', ')}
                WHERE id = ?
            `;
            
            this.db.prepare(updateQuery).run(...params);
            
            // If tags are provided, update them
            if (tags) {
                // Remove existing tags
                this.db.prepare('DELETE FROM note_tags WHERE note_id = ?').run(id);
                
                // Add new tags
                const insertNoteTag = this.db.prepare(`
                    INSERT INTO note_tags (note_id, tag_id)
                    VALUES (?, ?)
                `);
                
                const getOrCreateTag = this.db.prepare(`
                    INSERT OR IGNORE INTO tags (name) VALUES (?);
                    SELECT id FROM tags WHERE name = ?;
                `);
                
                for (const tagName of tags) {
                    const tag = getOrCreateTag.get(tagName, tagName);
                    insertNoteTag.run(id, tag.id);
                }
            }
            
            return id;
        });
        
        transaction();
        return this.getNoteById(id);
    }

    deleteNote(id: number): boolean {
        // Due to foreign key constraints with CASCADE, deleting the note will automatically
        // delete the associated note_tags entries
        const stmt = this.db.prepare('DELETE FROM notes WHERE id = ?');
        const info = stmt.run(id);
        return info.changes > 0;
    }

    close(): void {
        this.db.close();
    }
}
