import { injectable } from "inversify";
import { instanceOfAxios } from "../../../../infrastructure/library/axios";
import { ApiCreditsGatewayInterface } from "../interface/api.credits.gateway";

@injectable()
export class ApiCredit implements ApiCreditsGatewayInterface{
    async fetchSubscription(subscription_id: string): Promise<any> {
        const subscription = await instanceOfAxios.get(`subscriptions/${subscription_id}`)

        return subscription.data.data;
    }
    async fetchCustomer(customer_id:string): Promise<any> {
        
        const customer = await instanceOfAxios.get(`customers/${customer_id}`)

        return customer.data.data;
    }

}