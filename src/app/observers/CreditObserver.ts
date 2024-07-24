import { injectable } from "inversify";
import { Observer } from "./interface/IObserver";
import logger from "../../infrastructure/library/pino";
import { prisma } from "../../infrastructure/database/prisma/instanceOfPrisma";


@injectable()
export class CreditObserver implements Observer {
    async created(value: any): Promise<void> {
        logger.info(value)
        await prisma.loggers.create({
            data: {
                message: JSON.stringify(value),
                level: 'info'
            }
        })
        await prisma.historyCredit.create({
            data: {
                userId: value.customer_id,
                creditAmount: value.monthly_minutes,
                invoiceId: value.subscription_id,
                expirationAt: value.billing_period.ends_at,
                renewAt: value.billing_period.ends_at,
            }
        })
    }
    async deleted(value: string): Promise<void> {

    }
    async updated(value: string): Promise<void> {

    }

}