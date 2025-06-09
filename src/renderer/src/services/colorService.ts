import colorApi, {RawColor} from "../api/colorApi";
import Color from "../models/Color";

export function fromRawToColor(data: RawColor) {
    return new Color(
        data.id,
        data.name,
        data.is_default
    )
}

export function fromRawsToColors(data: Array<RawColor>) {
    return data.map((rawTag) => fromRawToColor(rawTag) );
}

const colorService = {
    getAll: async (): Promise<Color[]> => {
        const rawColors = await colorApi.getAll();
        return fromRawsToColors(rawColors)
    },
};

export default colorService;
