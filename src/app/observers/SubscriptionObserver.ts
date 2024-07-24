import { inject, injectable } from "inversify";
import { Observer } from "./interface/IObserver";
import logger from "../../infrastructure/library/pino";
import { prisma } from "../../infrastructure/database/prisma/instanceOfPrisma";
import { TYPES } from "../../infrastructure/library/inversify/types";
import { CreditsServiceInterface } from "../domain/Credits/interface/credits.service.interface";


@injectable()
export class SubscriptionObserver implements Observer {

    async created(value: any): Promise<void> {


        logger.info(value)
        await prisma.loggers.create({
            data: {
                message: JSON.stringify(value),
                level: 'info'
            }
        })


    }
    async deleted(value: string): Promise<void> {
        logger.info(value)
        await prisma.loggers.create({
            data: {
                message: value,
                level: 'info'
            }
        })
    }
    async updated(value: string): Promise<void> {
        logger.info(value)
        await prisma.loggers.create({
            data: {
                message: value,
                level: 'info'
            }
        })
    }

}