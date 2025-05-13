class Tag {
    id: number;
    name: string;

    constructor(data: { id: number; name: string }) {
        this.id = data.id;
        this.name = data.name;
    }

    static fromArray(dataArray: Array<{
        id  : number;
        name: string;
    }>): Tag[] {
        return dataArray.map((data) => new Tag(data));
    }

}

export default Tag
