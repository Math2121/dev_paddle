import { OptionalSubscription, SubscriptionData, SubscriptionRepositoryInterface } from "../../interfaces/SubscriptionRepositoryInterface";
import { Customer as CustomerPrisma, Price, Subscription as SubscriptionPrisma } from "@prisma/client";
import { Subscription } from "../../model";
export class MockSubscriptionRepository implements SubscriptionRepositoryInterface<SubscriptionPrisma> {
    subscription: SubscriptionPrisma[] = [{

        id: "sub_teste",
        customer_id: "ctm_teste",
        paddle_id: "sub_teste",
        status: 'active',
        product_id: "pro_teste",
        price_id: "pri_teste",
        createdAt: new Date(),
        updatedAt: new Date(),

    }, {

        id: "sub_teste2",
        customer_id: "ctm_teste2",
        paddle_id: "sub_teste2",
        status: 'active',
        product_id: "pro_teste",
        price_id: "pri_teste2",
        createdAt: new Date(),
        updatedAt: new Date(),

    }]
    async find(data: OptionalSubscription): Promise<Subscription | null> {

        const keys = Object.keys(data) as Array<keyof SubscriptionData>;

        for (const sub of this.subscription) {
            let found = true;

            for (const key of keys) {
                if (sub[key] !== data[key]) {
                    found = false;
                    break;
                }
            }

            if (found) {
                let subs = new Subscription(sub.customer_id,
                    sub.paddle_id,
                    sub.price_id ?? '', sub.product_id ?? '', sub.status)
                return subs;
            }
        }

        return null;
    }
    async update(data: OptionalSubscription): Promise<SubscriptionPrisma> {
        const index = this.subscription.findIndex((sub) => sub.id === data.id);

        const updatedSubscription = { ...this.subscription[index], ...data };
        this.subscription[index] = updatedSubscription;

        return updatedSubscription;
    }
    async changePriceId(subscription_id: string, new_price_id: string): Promise<SubscriptionPrisma> {
        return this.subscription[0]
    }
    async create(data: SubscriptionData): Promise<SubscriptionPrisma> {
        return this.subscription[0]
    }

}