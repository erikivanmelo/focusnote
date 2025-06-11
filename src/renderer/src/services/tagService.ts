import tagApi, {RawTag} from "../api/tagApi";
import Tag from "../models/Tag";

export function fromRawToTag(data: RawTag){
    return new Tag(
        data.id,
        data.name
    )
}

export function fromRawsToTags(data: Array<RawTag>) {
    return data.map((rawTag) => fromRawToTag(rawTag) );
}

const tagService = {
    getAllNames: async (): Promise<string[]> => {
        const tags = await tagApi.getAllNames();
        return tags;
    },
};

export default tagService;
