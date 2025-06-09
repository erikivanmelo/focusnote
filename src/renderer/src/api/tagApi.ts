export interface RawTag {
  id: number;
  name: string;
  color_id: number;
}

const tagApi = {
  getAll     : ():           Promise<RawTag[]     > => window.api.tag.getAll(),
  getOne     : (id: number): Promise<RawTag | null> => window.api.tag.getOne(id),
  getAllNames: ():           Promise<string[]     > => window.api.tag.getAllNames()
};

export default tagApi;
