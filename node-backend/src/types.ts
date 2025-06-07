import { RequestHandler } from 'express';

export type ServiceFunction = (...args: any[]) => any;
export type RouteHandler = RequestHandler | ServiceFunction;

export interface RouteConfig {
  [key: string]: string | RouteHandler;
}
