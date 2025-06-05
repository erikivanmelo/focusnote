import { Router, Request, Response, NextFunction } from 'express';
import noteService from '../services/noteService';

const router = Router();

// Route Handler para obtener todas las notas
const getAllHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notes = noteService.getAll();
        res.json(notes);
    } catch (error) {
        next(error);
    }
};

// Route Handler para obtener una nota por ID
const getByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const note = noteService.getOne(id);
        res.json(note);
    } catch (error) {
        next(error);
    }
};

// Route Handler para crear una nueva nota
const createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content, color_id, tags } = req.body;
        noteService.create(title, content, color_id, tags);
        res.status(201).json({ message: 'Nota creada exitosamente' });
    } catch (error) {
        next(error);
    }
};

// Route Handler para actualizar una nota
const updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const { title, content, color_id, tags } = req.body;
        noteService.update(id, title, content, color_id, tags);
        res.json({ message: 'Nota actualizada exitosamente' });
    } catch (error) {
        next(error);
    }
};

// Route Handler para eliminar una nota
const deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        noteService.delete(id);
        res.json({ message: 'Nota eliminada exitosamente' });
    } catch (error) {
        next(error);
    }
};

// Configurar rutas con los manejadores
router.get('/', getAllHandler);
router.get('/:id', getByIdHandler);
router.post('/', createHandler);
router.put('/:id', updateHandler);
router.delete('/:id', deleteHandler);

export const notesRouter = router;
