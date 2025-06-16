import {useGenericQueryNoParams} from "@renderer/hooks/useGenericQuery";
import Color from "@renderer/models/Color";
import colorService from "@renderer/services/colorService";

interface ColorSelectorProps {
    value?   : Color | null;
    onChange?: (color: Color) => void;
}

function ColorSelector({
    value = null,
    onChange = () => {}
}: ColorSelectorProps) {
    const {data: colors} = useGenericQueryNoParams<Color[]>(["colors"], colorService.getAll);

    return (
        <div className="input-colors">
            {colors?.map((color: Color) => (
                <label key={color.id}>
                    <input
                        type="radio"
                        value={color.name}
                        checked={color.id === value?.id}
                        onChange={() => onChange(color)}
                    />
                    <span className="checkmark"></span>
                </label>
            ))}
        </div>
    );
}
export default ColorSelector;
