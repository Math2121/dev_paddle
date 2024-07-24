import { injectable } from "inversify";
import { Observer } from "./interface/IObserver";
import logger from "../../infrastructure/library/pino";
import { prisma } from "../../infrastructure/database/prisma/instanceOfPrisma";


@injectable()
export class CustomerObserver implements Observer {
    async created(value: string): Promise<void> {
        logger.info(value)
        await prisma.loggers.create({
            data: {
                message: value,
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