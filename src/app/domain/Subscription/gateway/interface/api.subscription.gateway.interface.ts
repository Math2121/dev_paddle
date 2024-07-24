
export type ItemSubscription = {
    price_id: string
    quantity: number
    subscription_id: string
    typeOfPrice: string
}

export interface ApiSubscriptionGatewayInterface {
    fetchSubscriptionForChangePlan(item: ItemSubscription):Promise<any>;
    pausedSubscription(subscription_id: string): Promise<boolean>
    resumeSubscription(subscription_id: string): Promise<boolean> 
}