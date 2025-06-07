import dotenv from 'dotenv';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createRouter } from './utils/routeUtils';
import noteService from './services/noteService';
import colorService from './services/colorService';
import tagService from './services/tagService';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const notesRouter = createRouter(noteService, {
	get: [
		{ path: '/'	 , handler: 'getAll'  },
		{ path: '/:id', handler: 'getOne' }
	],
	post:   { path: '/'	 , handler: 'create'  },
	put:    { path: '/:id', handler: 'update' },
	delete: { path: '/:id', handler: 'delete' }
});

const colorsRouter = createRouter(colorService, {
	get: [
		{ path: '/'	 , handler: 'getAll' },
		{ path: '/:id', handler: 'getOne' }
	]
});

const tagsRouter = createRouter(tagService, {
	get: [
		{ path: '/'		 , handler: 'getAll'			},
		{ path: '/names', handler: 'getAllNames' }
	]
});

app.use('/api/notes', notesRouter);
app.use('/api/colors', colorsRouter);
app.use('/api/tags', tagsRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
