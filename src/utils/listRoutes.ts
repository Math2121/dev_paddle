import { Application, Router } from 'express';


interface RouteLayer {
    method: string;
}

interface Layer {
    handle?: Router;
    route?: {
        path: string;
        stack: { method: string }[];
    };
    name: string;
    regexp?: RegExp;
    path?: string;
    stack?: Layer[];
}

export function listRoutes(app: Application): void {
    const routes: string[] = [];

    app._router.stack.forEach((middleware: Layer) => {
        if (middleware.route) {

            middleware.route.stack.forEach((layer: RouteLayer) => {
                const method = layer.method.toUpperCase();
                routes.push(`${method} ${middleware.route?.path}`);
            });
        } else if (middleware.name === 'router' && middleware.handle) {

            middleware.handle.stack.forEach((handler: Layer) => {
                handler.route?.stack.forEach((layer: RouteLayer) => {
                    const method = layer.method.toUpperCase();
                    routes.push(`${method} ${middleware.regexp?.source.replace(/\\\//g, '/')}${handler.route?.path}`);
                });
            });
        }
    });

    console.log('Available routes:');
    routes.forEach(route => {
        console.log(route);
    });
}