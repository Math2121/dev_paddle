import { ApiSubscriptionGatewayInterface, ItemSubscription } from "../../gateway/interface/api.subscription.gateway.interface";

export class MockApiSubscription implements ApiSubscriptionGatewayInterface {
    async pausedSubscription(subscription_id: string): Promise<boolean> {
        if(!subscription_id) return false;
        return true;
    }
    async resumeSubscription(subscription_id: string): Promise<boolean> {
        if(!subscription_id) return false;
        return true;
    }
    async fetchSubscriptionForChangePlan(item: ItemSubscription): Promise<any> {
        if(!item) return false;
        return {
                    items: [
                        {
                            price:{
                                custom_data: {
                                    monthly_minutes: "100"
                                }
                            }
                        }
                    ],
                    current_billing_period: {
                        ends_at: '2021-08-01T00:00:00.000Z',
                        starts_at: '2021-07-01T00:00:00.000Z'
                    }
        };
    }

}