import { Subscription as SubscriptionPrisma } from "@prisma/client";
import { prisma } from "../../../../../infrastructure/database/prisma/instanceOfPrisma";
import { OptionalSubscription, SubscriptionData, SubscriptionRepositoryInterface } from "../../interfaces/SubscriptionRepositoryInterface";
import { injectable, multiInject } from "inversify";
import { Observer } from "../../../../observers/interface/IObserver";
import { Subscription } from "../../model";

@injectable()
export class SubscriptionRepository implements SubscriptionRepositoryInterface<SubscriptionPrisma> {
    constructor(@multiInject('ObserverSubscription') private observers: Observer[]) {
    }


    async find(data: OptionalSubscription): Promise<Subscription | null> {

        let dataRetrieve = await prisma.subscription.findFirst({
            where: {
                ...data
            }
        })

        if (!dataRetrieve) {
            return null
        }

        return new Subscription(
            dataRetrieve.customer_id,
            dataRetrieve.paddle_id,
            dataRetrieve.price_id ?? '',
            dataRetrieve.product_id ?? '',
            dataRetrieve.status)
    }




    async changePriceId(subscription_id: string, new_price_id: string): Promise<SubscriptionPrisma> {
        const subscription = await prisma.subscription.update({
            where: {
                paddle_id: subscription_id
            },
            data: {
                price_id: new_price_id
            }
        })
        await this.notifyUpdated("Subscription price Id updated, ID: " + subscription.id + "  updated, new price_id: " + new_price_id)
        return subscription
    }
    async create(subscriptionData: Subscription): Promise<SubscriptionPrisma> {
        try {

            const subscription = await prisma.subscription.create({
                data: {
                    id: subscriptionData.id,
                    customer_id: subscriptionData.customer_id,
                    paddle_id: subscriptionData.paddle_id,
                    status: subscriptionData.status,
                    price_id: subscriptionData.price_id,
                    product_id: subscriptionData.product_id
                }
            })

            await this.notifyCreated("Subscription updated, ID: " + subscription.id );
            return subscription

        } catch (error:any) {
            throw new Error(error)
        }
    }
    async update(data: OptionalSubscription): Promise<SubscriptionPrisma> {

        return await prisma.subscription.update({
            where: {
                paddle_id: data.paddle_id
            },
            data: {
                ...data
            }
        })
    }
    private async notifyCreated(value: any) {
        for (const observer of this.observers) {
            await observer.created(value);
        }
    }
    private async notifyUpdated(value: string) {
        for (const observer of this.observers) {
            await observer.updated(value);
        }
    }

}