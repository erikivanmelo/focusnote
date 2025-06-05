import { Router, Request, Response, NextFunction } from 'express';
import colorService from '../services/colorService';

const router = Router();

// Route Handler para obtener todos los colores
const getAllColorsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const colors = colorService.getAll();
        res.json(colors);
    } catch (error) {
        next(error);
    }
};

// Route Handler para obtener un color por ID
const getColorByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const color = colorService.getOne(id);
        res.json(color);
    } catch (error) {
        next(error);
    }
};

// Configurar rutas con los manejadores
router.get('/', getAllColorsHandler);
router.get('/:id', getColorByIdHandler);

export const colorsRouter = router;
