import sqlite3 from 'better-sqlite3';

async function runMigrations() {
	const db = sqlite3(process.env.DATABASE_PATH || './data/focusnote.db');

	// Create colors table
	db.exec(`
		CREATE TABLE IF NOT EXISTS colors (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL CHECK(length(name) <= 8),
			is_default BOOLEAN DEFAULT FALSE,
			UNIQUE(name)
		)
	`);

	// Insert default colors if they don't exist
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

	const insertColor = db.prepare(`
		INSERT OR IGNORE INTO colors (name, is_default)
		VALUES (?, ?)
	`);

	for (const color of defaultColors) {
		insertColor.run(color.name, color.is_default? 1 : 0);
	}

	// Create tags table
	db.exec(`
		CREATE TABLE IF NOT EXISTS tags (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL CHECK(length(name) <= 40),
			UNIQUE(name)
		)
	`);

	// Create notes table
	db.exec(`
		CREATE TABLE IF NOT EXISTS notes (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT CHECK(length(title) <= 100),
			content TEXT NOT NULL,
			created_at TEXT DEFAULT CURRENT_TIMESTAMP,
			updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
			color_id INTEGER,
			FOREIGN KEY (color_id) REFERENCES colors(id) ON DELETE SET NULL
		)
	`);

	// Create note_tags table
	db.exec(`
		CREATE TABLE IF NOT EXISTS note_tags (
			note_id INTEGER,
			tag_id INTEGER,
			PRIMARY KEY (note_id, tag_id),
			FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
			FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
		)
	`);

	console.log('Migraciones completadas exitosamente');
	db.close();
}

runMigrations().catch(console.error);
