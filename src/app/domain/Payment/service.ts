import "reflect-metadata"
import { inject, injectable } from "inversify";
import { throwServiceException } from "../../../utils/commonUtils";
import { InputPaymentDto, InputPaymentUpdateDto, OutPutPaymentDto, PaymentRepositoryInterface, PaymentServiceInterface } from "./interface/payment.interface";
import { Payment } from "./model";
import { TYPES } from "../../../infrastructure/library/inversify/types";
import {Payment as PaymentPrisma} from "@prisma/client"
import { ServiceException } from "../../../utils/customExceptions";
@injectable()
export class PaymentService implements PaymentServiceInterface{
    constructor(@inject(TYPES.PaymentRepository) private paymentRepository: PaymentRepositoryInterface<PaymentPrisma>) { }
    async updatePayment(data: InputPaymentUpdateDto): Promise<void> {
        try {
            const paymentExist = await this.paymentRepository.find(data.paddle_id)
            if (!paymentExist) {
                throw new ServiceException("Payment not found")
            }
            await this.paymentRepository.update({
                paddle_id: data.paddle_id,
                type: data.type,
                card_brand: data.card_brand,
                customer_id: data.customer_id,
                subscription_id: data.subscription_id,
                card_name: data.card_name,
                last4: data.last4
            });
    
        } catch (error:any) {
            throwServiceException(error)
        }
    }

    async createPayment(data: InputPaymentDto): Promise<OutPutPaymentDto> {
        try {
            const payment = new Payment(data.type, data.last4, data.card_name, data.card_brand);

            await this.paymentRepository.create({
                type: payment.type,
                last4: payment.last4,
                card_name: payment.card_name,
                card_brand: payment.card_brand,
                customer_id: data.customer_id,
                subscription_id: data.subscription_id,
                paddle_id: data.paddle_id

            });

            return {
                type: payment.type,
                last4: payment.last4,
                card_name: payment.card_name,
                card_brand: payment.card_brand,
            }

        } catch (error: any) {
            throwServiceException(error)
        }
    }
}