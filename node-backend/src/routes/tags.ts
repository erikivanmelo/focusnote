import { Router, Request, Response, NextFunction } from 'express';
import tagService from '../services/tagService';

const router = Router();

// Route Handler para obtener todos los tags
const getAllTagsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tags = tagService.getAll();
        res.json(tags);
    } catch (error) {
        next(error);
    }
};

const getAllTagNamesHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tags = tagService.getAllNames();
        res.json(tags);
    } catch (error) {
        next(error);
    }
};

// Configurar rutas con los manejadores
router.get('/', getAllTagsHandler);
router.get('/names', getAllTagNamesHandler);

export const tagsRouter = router;
