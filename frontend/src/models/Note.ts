import Color from "./Color"
import Tag from "./Tag"

class Note {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    color: Color;
    tags: Tag[];

    constructor(data: {
        id: number;
        title: string;
        content: string;
        created_at: string;
        updated_at: string;
        color_details: { id: number; name: string };
        tags_details: Array<{ id: number; name: string }>;
    }) {
        this.id = data.id;
        this.title = data.title;
        this.content = data.content;
        this.createdAt = new Date(data.created_at);
        this.updatedAt = new Date(data.updated_at);
        this.color = new Color(data.color_details);
        this.tags = Tag.fromArray(data.tags_details);
    }

    static fromArray(dataArray: Array<{
        id: number;
        title: string;
        content: string;
        created_at: string;
        updated_at: string;
        color_details: { id: number; name: string };
        tags_details: Array<{ id: number; name: string }>;
    }>): Note[] {
        return dataArray.map((data) => new Note(data));
    }
}

export default Note
