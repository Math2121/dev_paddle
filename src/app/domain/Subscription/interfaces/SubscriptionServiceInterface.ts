import { Subscription } from "../model"

export type RequestForSubscription = {
    customer_id: string,
    paddle_id: string,
    price_id: string,
    product_id: string,
    status: string
}
export interface SubscriptionServiceInterface {
    changePlan(customer_id: string, price_id: string): Promise<void>
    createSubscription(requestData: RequestForSubscription): Promise<Subscription | undefined>
    pauseRenovation(customer_id: string): Promise<void>
    resumeRenovation(customer_id: string): Promise<void>

}