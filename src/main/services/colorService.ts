import colorController, {RawColor} from "../controllers/colorController";

export interface Color {
    id: number;
    name: string;
    is_default: boolean;
}

export interface GetOneNoteParams {
   id:number;
}
function fromRawToColor(note: RawColor): Color {
    return {
        id: note.id,
        name: note.name,
        is_default: note.is_default
    };
}
const colorService = {
    getAll: () => {
        const rawColors = colorController.getAll();
        return rawColors.map(
            (note) => fromRawToColor(note)
        ) as Color[];
    },
    getOne: (params: GetOneNoteParams) => {
        return fromRawToColor(colorController.getOne(params.id));
    }
};

export default colorService;
