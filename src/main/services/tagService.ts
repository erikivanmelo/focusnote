import tagController from "../controllers/tagController";

export interface Tag {
   id  : number;
   name: string;
}

export interface GetAllByNoteParams {
   noteId: number;
}

export interface CreateOrIgnoreParams {
   names: string[];
}

export interface DeleteTagParams {
   id: number;
}

const tagService = {
    getAll: (): Tag[]  => {
        return tagController.getAll() as Tag[];
    },

    getAllNames: (): string[] => {
        return tagController.getAllNames() as string[];
    },

    getAllByNote: (params: GetAllByNoteParams): Tag[] => {
        return tagController.getAllByNote(params.noteId) as Tag[];
    },

    createOrIgnore: (params: CreateOrIgnoreParams): void => {
        tagController.createOrIgnore(params.names);
    }
}

export default tagService;
