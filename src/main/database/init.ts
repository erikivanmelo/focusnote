import { DatabaseService } from './database.service';

let dbService: DatabaseService;

/**
 * Initializes the database service and creates all necessary tables
 * @returns The initialized DatabaseService instance
 */
export function initDatabase(): DatabaseService {
    if (dbService) {
        return dbService;
    }

    // This will initialize the database and create all tables
    dbService = new DatabaseService();
    
    return dbService;
}

/**
 * Gets the database service instance
 * @returns The DatabaseService instance
 * @throws Error if the database service has not been initialized
 */
export function getDatabaseService(): DatabaseService {
    if (!dbService) {
        throw new Error('Database service has not been initialized. Call initDatabase() first.');
    }
    return dbService;
}
