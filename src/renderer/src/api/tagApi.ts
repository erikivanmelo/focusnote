import { apiArrayCall } from './apiUtils';

export interface RawTag {
  id: number;
  name: string;
}

const tagApi = {
  getAllNamesInUse: () => apiArrayCall<string>('tag', 'getAllNamesInUse'),
};

export default tagApi;
