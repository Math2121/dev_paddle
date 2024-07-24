import { injectable } from "inversify";
import { SUBSCRIPTION_LOWER_OR_HIGHER } from "../../../../config/constants";
import { awsLogger } from "../../../../infrastructure/library/awsLogger";
import { instanceOfAxios } from "../../../../infrastructure/library/axios";
import { ApiSubscriptionGatewayInterface, ItemSubscription } from "./interface/api.subscription.gateway.interface";
import { RouterException } from "../../../../utils/customExceptions";

@injectable()
export class ApiSubscriptionGateway implements ApiSubscriptionGatewayInterface{
    async fetchSubscriptionForChangePlan(item: ItemSubscription): Promise<any> {
        try {
            let proration_type;

            if (item.typeOfPrice === SUBSCRIPTION_LOWER_OR_HIGHER.LOWER) {
                proration_type = "prorated_immediately"
            } else {
                proration_type = "full_next_billing_period"
            }
            let subscriptionUpdated = await instanceOfAxios.patch(`subscriptions/${item.subscription_id}`, {
                "items": [
                    { "price_id": item.price_id, "quantity": item.quantity }
                ],
                "proration_billing_mode": proration_type,
            });
            awsLogger.info(`Subscription ${item.subscription_id} changed`)
            return subscriptionUpdated.data.data
        } catch (error: any) {
            let errorParser = JSON.stringify(error)
            awsLogger.error({
                message: `Subscription ${item.subscription_id}  could not be changed; error: ${errorParser} `,
            })
            throw new RouterException(error)
        }
    }
    async pausedSubscription(subscription_id: string): Promise<boolean> {
        try {
            await instanceOfAxios.post(`subscriptions/${subscription_id}/pause`, {
                "effective_from": "immediately"
            })
            awsLogger.info(`Subscription ${subscription_id} paused`)
            return true
        } catch (error: any) {
            let errorParser = JSON.stringify(error.response.data)

            awsLogger.error({
                message: `Subscription ${subscription_id}  could not be paused; error: ${errorParser} `,
            })
            throw new Error(error)
        }

    }
    async resumeSubscription(subscription_id: string): Promise<boolean> {

        try {
            await instanceOfAxios.post(`subscriptions/${subscription_id}/resume`, {
                "effective_from": "immediately"
            })
            
            awsLogger.info(`Subscription ${subscription_id} resumed`)
            return true
        } catch (error: any) {
            let errorParser = JSON.stringify(error.response.data)

            awsLogger.error({
                message: `Subscription ${subscription_id}  could not be resumed; error: ${errorParser} `,
            })
            throw new Error(error)
        }
    }
}
