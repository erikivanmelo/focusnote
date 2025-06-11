import { apiArrayCall, apiObjectCall } from './apiUtils';
import {RawColor} from './colorApi';
import {RawTag} from './tagApi';

export interface RawNote {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  color_details: RawColor;
  tags_details: RawTag[];
}

const noteApi = {
  getAll: () => apiArrayCall<RawNote>('note', 'getAll'),
  getOne: (id: number) => apiObjectCall<RawNote>('note', 'getOne', {id: id}),
  create: (data: any) => apiObjectCall<RawNote>('note', 'create', data),
  update: (data: any) => apiObjectCall<RawNote>('note', 'update', data),
  remove: (id: number) => apiObjectCall<boolean>('note', 'delete', {id: id}),
};

export default noteApi;


