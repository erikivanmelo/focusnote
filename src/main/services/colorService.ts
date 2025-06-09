import colorController, {RawColor} from "../controllers/colorController";

export interface Color {
    id: number;
    name: string;
    is_default: boolean;
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
};

export default colorService;
