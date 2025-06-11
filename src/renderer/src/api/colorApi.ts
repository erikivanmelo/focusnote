import { apiArrayCall, apiObjectCall } from './apiUtils';

export interface RawColor {
  id: number;
  name: string;
  is_default: boolean;
}

const colorApi = {
  getAll: () => apiArrayCall<RawColor>('color', 'getAll'),
  getOne: (id: number) => apiObjectCall<RawColor>('color', 'getOne', id),
};

export default colorApi;
