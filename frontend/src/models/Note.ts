import Color, { RawColor } from "./Color"
import Tag, { RawTag } from "./Tag"

export type RawNote = {
    id           : number;
    title        : string;
    content      : string;
    created_at   : string;
    updated_at   : string;
    color        : number;
    color_details: RawColor;
    tags_details : Array<RawTag>;
}

class Note {
    id       : number;
    title    : string;
    content  : string;
    createdAt: Date;
    updatedAt: Date;
    color    : Color;
    tags     : Tag[];

    constructor(data: RawNote) {
        this.id        = data.id;
        this.title     = data.title;
        this.content   = data.content;
        this.createdAt = new Date(data.created_at);
        this.updatedAt = new Date(data.updated_at);
        this.color     = new Color(data.color_details);
        this.tags      = data.tags_details.map((tag) => new Tag(tag));
    }

    toRaw(): RawNote {
        return {
            id           : this.id,
            title        : this.title,
            content      : this.content,
            created_at   : this.createdAt.toISOString(),
            updated_at   : this.updatedAt.toISOString(),
            color        : this.color.id,
            color_details: this.color.toRaw(), 
            tags_details : this.tags.map((tag) => tag.toRaw()),
        };
    }
}

export default Note
