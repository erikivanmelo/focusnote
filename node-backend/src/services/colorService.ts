import colorController from "../controllers/colorController";

export interface Color {
   id        : number;
   name      : string;
   is_default: boolean;
}

export interface GetOneColorParams {
   id: number;
}

const colorService = {
    getAll: (): Color[] => {
        return colorController.getAll() as Color[];
    },

    getOne: (params: GetOneColorParams): Color => {
        return colorController.getOne(params.id) as Color;
    },
}

export default colorService;
