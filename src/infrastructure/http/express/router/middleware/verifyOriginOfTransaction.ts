import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export default function verifyOriginOfTransaction(req: Request, res: Response, next: NextFunction) {
    try {
        const validObject = z.object({
            data: z.object({
                origin: z.string()
            })
        })

        const { data: { origin } } = validObject.parse(req.body);

        if (origin === "subscription_payment_method_change") {
            return res.status(204).send({
                message: "Transaction type is not apply for credits"
            });
        }



        if (origin == "web" || origin == "subscription_recurring") {
            next()
        }

    } catch (error) {
        next(error)
    }

}