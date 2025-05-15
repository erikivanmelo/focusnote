export type RawColor = {
   id  : number;
   name: string;
}

class Color {
    id  : number;
    name: string;

    constructor(data: RawColor) {
        this.id   = data.id;
        this.name = data.name;
    }

    toRaw(): RawColor {
        return {
            id  : this.id,
            name: this.name
        }
    }
}

export default Color
