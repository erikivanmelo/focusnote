import { apiArrayCall } from './apiUtils';

export interface RawTag {
  id: number;
  name: string;
}

const tagApi = {
  getAllNames: () => apiArrayCall<string>('tag', 'getAllNames'),
};

export default tagApi;
