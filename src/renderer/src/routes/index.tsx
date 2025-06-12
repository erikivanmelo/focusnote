import { createHashRouter } from 'react-router-dom';
import routesConfig from './routesConfig';

export const router = createHashRouter(routesConfig, {});
export default router;
