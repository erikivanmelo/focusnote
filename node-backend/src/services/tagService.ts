import tagController from "../controllers/tagController";

export interface Tag {
   id  : number;
   name: string;
}

const tagService = {
    getAll: (): Tag[]  => {
        return tagController.getAll() as Tag[];
    },

    getAllNames: (): string[] => {
        return tagController.getAllNames() as string[];
    },

    getAllByNote: (noteId: number): Tag[] => {
        return tagController.getAllByNote(noteId) as Tag[];
    },

    createOrIgnore: (names: string[]): void => {
        tagController.createOrIgnore(names);
    }
};

export default tagService;
