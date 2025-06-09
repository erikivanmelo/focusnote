import { apiArrayCall, apiObjectCall } from './apiUtils';
import { RawColor } from './types';

const colorApi = {
  getAll: () => apiArrayCall<RawColor>('color', 'getAll'),
  getOne: (id: number) => apiObjectCall<RawColor>('color', 'getOne', id),
};

export default colorApi;
