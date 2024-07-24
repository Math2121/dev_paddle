import { NextFunction, Request, Response } from "express";
import { RouterException } from "../../../../../utils/customExceptions";

export default function verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        let token = req.headers.authorization

        if (!token) {
            throw new RouterException("Missing token")
        }


        next()
    } catch (error) {
        next(error)
    }

}