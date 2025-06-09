import { apiArrayCall, apiObjectCall } from './apiUtils';
import { RawTag } from './types';

const tagApi = {
  getAll: () => apiArrayCall<RawTag>('tag', 'getAll'),
  getOne: (id: number) => apiObjectCall<RawTag>('tag', 'getOne', id),
  create: (data: any) => apiObjectCall<RawTag>('tag', 'create', data),
  update: (data: any) => apiObjectCall<RawTag>('tag', 'update', data),
  remove: (id: number) => apiObjectCall<boolean>('tag', 'delete', id),
};

export type TagApi = typeof tagApi;

export default tagApi;
