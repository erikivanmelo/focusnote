export type RawTag = {
   id  : number;
   name: string;
}

class Tag {
    id  : number;
    name: string;

    constructor(data: RawTag) {
        this.id   = data.id;
        this.name = data.name;
    }

    toRaw(): RawTag {
        return {
            id  : this.id,
            name: this.name
        }
    }
}

export default Tag
