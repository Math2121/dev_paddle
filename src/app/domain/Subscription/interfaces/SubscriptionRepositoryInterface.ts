import { Subscription } from "../model"

export type SubscriptionData = {
    customer_id: string,
    paddle_id: string,
    price_id: string,
    product_id: string,
    status: string,
    id: string
}
export interface OptionalSubscription extends Partial<SubscriptionData> { }


export interface SubscriptionRepositoryInterface<T> {
    create(data: Subscription): Promise<T>
    changePriceId(subscription_id: string, new_price_id: string): Promise<T>
    find(data: OptionalSubscription): Promise<Subscription | null>
    update(data: OptionalSubscription): Promise<T>
}