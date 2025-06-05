import colorController from "../controllers/colorController";

export interface Color {
   id        : number;
   name      : string;
   is_default: boolean;
}

const colorService = {
    getAll: (): Color[] => {
        return colorController.getAll() as Color[];
    },

    getOne: (id: number): Color => {
        return colorController.getOne(id) as Color;
    },
}

export default colorService;
