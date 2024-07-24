import { injectable } from "inversify";
import { prisma } from "../../../../../infrastructure/database/prisma/instanceOfPrisma";
import { InputPaymentDto, InputPaymentUpdateDto, OutPutPaymentDto, PaymentRepositoryInterface } from "../../interface/payment.interface";
import { Payment } from "@prisma/client";

@injectable()
export default class PaymentRepository implements PaymentRepositoryInterface<Payment> {
    async find(paddle_id: string): Promise<Payment | null> {
        return await prisma.payment.findFirst({
            where: { paddle_id }
        })
    }
    async update(input: InputPaymentUpdateDto): Promise<void> {

        let payment = await this.find(input.paddle_id)
        await prisma.payment.update({
            where: {
                id: payment?.id
             },
            data: {
                type: input.type,
                card_brand: input.card_brand ?? '',
                customer_id: input.customer_id,
                subscription_id: input.subscription_id,
                card_name: input.card_name ?? '',
                last4: input.last4 ?? '',
            }
        })
    }
    async create(payment: InputPaymentDto): Promise<void> {
        await prisma.payment.create({
            data: {
                type: payment.type,
                card_brand: payment.card_brand,
                customer_id: payment.customer_id,
                subscription_id: payment.subscription_id,
                card_name: payment.card_name,
                last4: payment.last4,
                paddle_id: payment.paddle_id
            }
        })
    }



}