import Color from "./Color";
import Tag from "./Tag";

class Note {
	id: number;
	title: string;
	content: string;
	createdAt: Date | null;
	updatedAt: Date | null;
	color: Color;
	tags: Tag[];

	constructor(
		id: number,
		title: string,
		content: string,
		color: Color,
		tags: Tag[],
		createdAt: Date | null = null,
		updatedAt: Date | null = null,
	) {
		this.id = id;
		this.title = title;
		this.content = content;
		this.color = color;
		this.tags = tags;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}

export default Note;
