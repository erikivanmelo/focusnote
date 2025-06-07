import { Router, Request, Response, NextFunction } from 'express';

type ServiceFunction = (...args: any[]) => any;

interface RouteConfig {
	[method: string]: {
		path: string;
		handler: string | ServiceFunction;
	} | {
		path: string;
		handler: string | ServiceFunction;
	}[];
}

const HTTP_METHODS = ['get', 'post', 'put', 'delete'] as const;

type HttpMethod = typeof HTTP_METHODS[number];

function createHandler(service: any, handlerName: string): (req: Request, res: Response, next: NextFunction) => void {
	return (req, res, next) => {
		try {
			const serviceMethod = handlerName as keyof typeof service;
			const method = service[serviceMethod];
			
			// Get the service function parameters
			const fn = method.toString();
			const match = fn.match(/\(([^)]*)\)/);
			const paramNames = match ? match[1].split(',').map((p: string) => p.trim()).filter(Boolean) : [];
			
			// If the service expects a single params object
			if (paramNames.length === 1 && paramNames[0] === 'params') {
				// Build the params object
				const params = {};
				
				// Add URL params
				Object.keys(req.params).forEach(key => {
					const value = req.params[key];
					if (typeof value === 'string' && !isNaN(Number(value))) {
						(params as any)[key] = Number(value);
					} else {
						(params as any)[key] = value;
					}
				});
				
				// Add body params
				if (req.body) {
					Object.keys(req.body).forEach(key => {
						const value = req.body[key];
						if (typeof value === 'string' && !isNaN(Number(value))) {
							(params as any)[key] = Number(value);
						} else {
							(params as any)[key] = value;
						}
					});
				};
				
				// Execute method with wrapped params
				const result = method(params);
				res.json(result);
				return;
			}
			
			// For methods that expect individual parameters
			const params = {};
			
			// Add URL params
			Object.keys(req.params).forEach(key => {
				if (paramNames.includes(key)) {
					const value = req.params[key];
					if (typeof value === 'string' && !isNaN(Number(value))) {
						(params as any)[key] = Number(value);
					} else {
						(params as any)[key] = value;
					}
				}
			});
			
			// Add body params
			if (req.body) {
				Object.keys(req.body).forEach(key => {
					if (paramNames.includes(key) && !(key in params)) {
						const value = req.body[key];
						if (typeof value === 'string' && !isNaN(Number(value))) {
							(params as any)[key] = Number(value);
						} else {
							(params as any)[key] = value;
						}
					}
				});
			}
			
			// Validate required parameters
			for (const paramName of paramNames) {
				if (!(paramName in params)) {
					throw new Error(`Missing required parameter: ${paramName}`);
				}
			}
			
			// Execute service method
			const result = method(params);
			res.json(result);
		} catch (error) {
			next(error);
		}
	};
}

export function createRouter(service: any, routes: RouteConfig) {
	const router = Router();
	
	Object.entries(routes).forEach(([method, route]) => {
		const methodType = method.toLowerCase() as HttpMethod;
		const routesArray = Array.isArray(route) ? route : [route];
		
		routesArray.forEach((route) => {
			const handler = typeof route.handler === 'string'
				? createHandler(service, route.handler)
				: route.handler;
			
			switch (methodType) {
				case 'get':
					return router.get(route.path, handler);
				case 'post':
					return router.post(route.path, handler);
				case 'put':
					return router.put(route.path, handler);
				case 'delete':
					return router.delete(route.path, handler);
			}
		});
	});
	
	return router;
}
