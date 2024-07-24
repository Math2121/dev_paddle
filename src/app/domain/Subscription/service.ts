import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/library/inversify/types";
import { RequestForSubscription, SubscriptionServiceInterface } from "./interfaces/SubscriptionServiceInterface";

import { ServiceException } from "../../../utils/customExceptions";
import { CustomerRepositoryInterface } from "../Customer/interfaces/CustomerRepositoryInterface";
import { Customer as CustomerPrisma, Price, Subscription as SubscriptionPrisma } from "@prisma/client";
import { SUBSCRIPTION_LOWER_OR_HIGHER } from "../../../config/constants";
import { Subscription } from "./model";
import { SubscriptionRepositoryInterface } from "./interfaces/SubscriptionRepositoryInterface";
import { throwServiceException } from "../../../utils/commonUtils";

import PriceRepositoryInterface from "../Price/repository/interface/price.interface";
import { ApiSubscriptionGatewayInterface } from "./gateway/interface/api.subscription.gateway.interface";




@injectable()
export class SubscriptionService implements SubscriptionServiceInterface {

    constructor(
        @inject(TYPES.CustomerRepositoryInterface) private customerRepository: CustomerRepositoryInterface<CustomerPrisma>,
        @inject(TYPES.PriceRepositoryInterface) private priceRepositoryInterface: PriceRepositoryInterface<Price>,
        @inject(TYPES.ApiSubscriptionInterface) private apiSubscription: ApiSubscriptionGatewayInterface,
        @inject(TYPES.SubscriptionRepositoryInterface) private subscriptionRepositoryInterface: SubscriptionRepositoryInterface<SubscriptionPrisma>) {
    }
    async resumeRenovation(customer_id: string): Promise<void> {
        try {
            let subscriptionRetrieve = await this.subscriptionRepositoryInterface.find({ customer_id: customer_id })
            if (subscriptionRetrieve === null) {
                throw new ServiceException("Could not find subscription");
            }

            if (subscriptionRetrieve.status !== "paused") {
                throw new ServiceException("Subscription is not paused");
            }


            let response = await this.apiSubscription.resumeSubscription(subscriptionRetrieve.paddle_id)

            if (response) {
                subscriptionRetrieve.changeStatus('active')
                await this.subscriptionRepositoryInterface.update({ paddle_id: subscriptionRetrieve.paddle_id, status: subscriptionRetrieve.status })
            }
        } catch (error: any) {
            throwServiceException(error)
        }
    }

    async pauseRenovation(customer_id: string): Promise<void> {
        try {
            let subscription = await this.subscriptionRepositoryInterface.find({ customer_id: customer_id })

            if (subscription === null) {
                throw new ServiceException("Could not find subscription");
            }

            if (subscription.status !== "active") {
                throw new ServiceException("Subscription is not active");
            }
            let response =  await this.apiSubscription.pausedSubscription(subscription.paddle_id)
            if(response){
                subscription.changeStatus('paused')
                await this.subscriptionRepositoryInterface.update({ paddle_id: subscription.paddle_id, status: subscription.status })
            }
        } catch (error: any) {
            throwServiceException(error)
        }
    }

    async createSubscription(requestData: RequestForSubscription): Promise<Subscription | undefined> {
        try {

            const subscription = new Subscription(requestData.customer_id, requestData.paddle_id, requestData.price_id, requestData.product_id, 'active');


            await this.subscriptionRepositoryInterface.create(
                subscription,
            )
            
            return subscription
        } catch (error: any) {
            throwServiceException(error)
        }
    }
    async changePlan(customer_id: string, price_id: string): Promise<any> {
        try {
     
            const subscription = await this.checkIfSubscriptionIsActive(customer_id)

            await this.checkIfCustomerIsActive(customer_id)

            const isLowerPrice = await this.checkIfPriceIsLowerThanActualPrice(subscription, price_id);

            let response = await this.apiSubscription.fetchSubscriptionForChangePlan({
                price_id: price_id,
                quantity: 1,
                typeOfPrice: isLowerPrice,
                subscription_id: subscription.paddle_id
            });
            
            if (response) {

                const responseSubscriptionUpdated = await this.subscriptionRepositoryInterface.changePriceId(subscription.paddle_id, price_id)
                
                return responseSubscriptionUpdated
            }
        } catch (error: any) {
            throwServiceException(error);
        }
    }

    async checkIfCustomerIsActive(customer_id: string) {
        const customer = await this.customerRepository.findCustomerByPaddleId(customer_id);

        if(customer && customer.customer_status != "active") {
            throw new ServiceException("Customer is not active");
        }
    }

    async checkIfPriceIsLowerThanActualPrice(itemsOfSubscription: any, price_id: string): Promise<string> {

        const price = await this.priceRepositoryInterface.find(price_id)
        const priceUsed = await this.priceRepositoryInterface.find(itemsOfSubscription.price_id)

        if (itemsOfSubscription.price_id === price?.paddle_id) {
            throw new ServiceException('The same price is used');
        }

        if (priceUsed?.currency_code !== price?.currency_code) {
            throw new ServiceException("Currencies do not match");
        }
        if (!price || !price.amount) {
            throw new ServiceException(`Price not found or amount is null`);
        }
        const newPriceAmount = +price.amount;
        if (!priceUsed || !priceUsed.amount) {
            throw new ServiceException(`Price used not found or amount is null`);
        }
        const priceUsedAmount = +priceUsed.amount;

        if (newPriceAmount > priceUsedAmount) {
            return SUBSCRIPTION_LOWER_OR_HIGHER.LOWER
        }

        return SUBSCRIPTION_LOWER_OR_HIGHER.HIGHER
    }
    async checkIfSubscriptionIsActive(customer_id: string): Promise<Subscription> {

        const subscription = await this.subscriptionRepositoryInterface.find({
            customer_id: customer_id
        })

        if (subscription?.status !== 'active') {
            throw new ServiceException("Subscription is not active");
        }

        return subscription
    }


}