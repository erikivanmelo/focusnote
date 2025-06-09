import { apiArrayCall, apiObjectCall } from './apiUtils';
import { RawNote } from './types';

const noteApi = {
  getAll: () => apiArrayCall<RawNote>('note', 'getAll'),
  getOne: (id: number) => apiObjectCall<RawNote>('note', 'getOne', id),
  create: (data: any) => apiObjectCall<RawNote>('note', 'create', data),
  update: (data: any) => apiObjectCall<RawNote>('note', 'update', data),
  remove: (id: number) => apiObjectCall<boolean>('note', 'delete', id),
};

export default noteApi;


