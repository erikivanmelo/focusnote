class Color {
    id  : number;
    name: string;
    isDefault: boolean;

    constructor(
        id  : number,
        name: string,
        isDefault: boolean = false
    ) {
        this.id   = id;
        this.name = name;
        this.isDefault = isDefault
    }
}

export default Color
