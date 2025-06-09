import { RawColor } from '../api/types';
import colorApi from '../api/colorApi';
import Color from '../models/Color';

export function fromRawToColor(data: RawColor): Color {
    return new Color(
        data.id,
        data.name,
        data.is_default
    );
}

export function fromRawsToColors(data: RawColor[]): Color[] {
    return data.map((rawColor) => fromRawToColor(rawColor));
}

export interface ColorService {
    getAll: () => Promise<Color[]>;
}

const colorService: ColorService = {
    getAll: async (): Promise<Color[]> => {
        const rawColors = await colorApi.getAll();
        return fromRawsToColors(rawColors);
    }
};

export default colorService;
