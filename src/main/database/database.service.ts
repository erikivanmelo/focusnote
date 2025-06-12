import { app } from 'electron';
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

    close(): void {
        this.db.close();
    }
}
