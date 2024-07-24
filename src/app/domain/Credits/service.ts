import { inject, injectable } from "inversify";
import { CreditData, CreditUpdateData, CreditsServiceInterface } from "./interface/credits.service.interface";
import { TYPES } from "../../../infrastructure/library/inversify/types";
import { CreditsRepositoryInterface } from "./repository/interface/credits.repository.interface";
import { ServiceException } from "../../../utils/customExceptions";
import { CustomerRepositoryInterface } from "../Customer/interfaces/CustomerRepositoryInterface";
import { Customer as CustomerPrimsa, Subscription } from "@prisma/client";
import { formatCurrencie, formatForTimeStamp } from "../../../utils/commonUtils";
import { SubscriptionRepositoryInterface } from "../Subscription/interfaces/SubscriptionRepositoryInterface";
import logger from "../../../infrastructure/library/pino";
@injectable()
export class CreditsService implements CreditsServiceInterface {

    constructor(
        @inject(TYPES.CreditsRepositoryInterface) private creditRepository: CreditsRepositoryInterface,
        @inject(TYPES.CustomerRepositoryInterface) private customerRepository: CustomerRepositoryInterface<CustomerPrimsa>,
        @inject(TYPES.SubscriptionRepositoryInterface) private subscriptionRepository: SubscriptionRepositoryInterface<Subscription>
    ) {
    }
    async updateCredit(values: CreditUpdateData): Promise<void> {
        try {
            values.customer_id = await this.getTheCustomer(values.customer_id)

            values.monthly_minutes = formatCurrencie(values.monthly_minutes)
            values.ends_at = formatForTimeStamp(values.ends_at)

            let creditsOlder = await this.creditRepository.selectCreditsByUser(values.customer_id)
            if (!creditsOlder) {
                throw new ServiceException("Credit not found")
            }
            await this.creditRepository.update(values);
            await this.creditRepository.create({
                billing_period:{
                    ends_at:values.ends_at
                },
                customer_id: values.customer_id,
                monthly_minutes: values.monthly_minutes,
                subscription_id: values.subscription_id,
                product_name: values.name,
                spent_amount: creditsOlder.spent_amount
            });
            logger.info("Update credit successfully ")
        } catch (error: any) {
            throw new ServiceException(error)
        }
    }

    async registerCredit(values: CreditData): Promise<void> {

        try {
            values.customer_id = await this.getTheCustomer(values.customer_id)
            await this.verifySubscription(values.subscription_id)

            values.monthly_minutes = formatCurrencie(values.monthly_minutes)
            values.billing_period.ends_at = formatForTimeStamp(values.billing_period.ends_at)

            const creditsAlreadyExist = await this.creditRepository.selectCreditHistory(
                values.subscription_id, 
                values.billing_period.ends_at)
            if (creditsAlreadyExist) {
                throw new ServiceException("Credit for this subscription already exists")
            }

            await this.creditRepository.create(values);
            logger.info("Credit created successfully")

        } catch (error: any) {
            throw new ServiceException(error)
        }
    }

    private async getTheCustomer(customer_id: string) {
        const customer = await this.customerRepository.findCustomerByPaddleId(customer_id)

        if (!customer) {
            throw new ServiceException("Customer not found")
        }
        return await this.customerRepository.getUserIdByEmail(customer.customer_email)
    }

    private async verifySubscription(subscription_id: string) {
        const subscription = await this.subscriptionRepository.find({
            paddle_id: subscription_id
        })
        if (!subscription) {
            throw new ServiceException("Subscription not found")
        }
        if (subscription.status !== 'active') {
            throw new ServiceException("Subscription is not currently active")
        }
    }

}