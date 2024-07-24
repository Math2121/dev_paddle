export interface ApiCreditsGatewayInterface {
    fetchCustomer(customer_id:string): Promise<any>;
    fetchSubscription(subscription_id:string): Promise<any>;
}