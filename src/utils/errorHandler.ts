import { AxiosError } from "axios";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { RepositoryException, RouterException, ServiceException } from "./customExceptions";
import logger from "../infrastructure/library/pino";


import { ModelException } from "./customExceptions";
import { prisma } from "../infrastructure/database/prisma/instanceOfPrisma";


export async function errorHandler(err: Error | AxiosError, req: Request, res: Response, next: NextFunction) {
    let status: number;
    let errorResponse: any;

    if (err instanceof ZodError) {
        status = 401;
        errorResponse = err.errors;

    } else if (isAxiosError(err)) {
        status = err.response?.status || 500;
        errorResponse = err.message || 'Axios error';
    } else if (err instanceof ServiceException) {
        status = 500;
        errorResponse = err.message;
    }
    else if (err instanceof ModelException) {
        status = 500;
        errorResponse = err.message;
    } else if (err instanceof RepositoryException) {
        status = 500;
        errorResponse = err.message;
    } else if (err instanceof RouterException) {
        status = 403;
        errorResponse = err.message;
    } else {
        status = 500;
        errorResponse = err.message;
    }
    await prisma.loggers.create({
        data: {
            message: err.message,
            level: 'error'
        }

    })
    logger.error({ error: err })
    res.status(status).json({
        error: {
            message:errorResponse,
            code: status,
            timestamp: new Date().toISOString()
        }
    });
    next();
}

function isAxiosError(err: Error | AxiosError<unknown>): err is AxiosError<unknown> {
    return (err as AxiosError<unknown>).isAxiosError !== undefined;
}