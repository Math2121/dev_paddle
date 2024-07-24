import { Router } from 'express';
import { z } from 'zod';


import { TYPES } from '../../../library/inversify/types';
import { PriceServiceInterface } from '../../../../app/domain/Price/interface/service.interface';
import { container } from '../../../library/inversify/inversify.config';
import { PaymentServiceInterface } from '../../../../app/domain/Payment/interface/payment.interface';


export const paymentRouter = Router();
const service = container.get<PaymentServiceInterface>(TYPES.PaymentService)


paymentRouter.post('/create', async (req, res, next) => {
    try {
        const validRequest = z.object({
            data: z.object({
                id: z.string(),
                customer_id: z.string(),
                subscription_id: z.string(),
                origin: z.string(),
                payments: z.array(z.object({
                    method_details:z.object({
                        card: z.object({
                            last4: z.string().nullable(),
                            cardholder_name: z.string().nullable(),
                            type: z.string().nullable()
    
                        }).nullable(),
                        type: z.string()
                    })
                }))
            })
        })
        const { data: {
            customer_id,
            subscription_id,
            payments,
            origin,
            id
        }

        } = validRequest.parse(req.body)
        if (origin == "web") {
            await service.createPayment({
                customer_id,
                subscription_id,
                paddle_id: id,
                card_brand: payments[0].method_details.card?.type ?? '',
                last4: payments[0].method_details.card?.last4 ?? '',
                card_name: payments[0].method_details.card?.cardholder_name ?? '',
                type: payments[0].method_details.type

            })
            return res.status(204).send()
        }
        return res.status(204).send({
            message: "Not applied"
        })
    } catch (error) {
        next(error);
    }

})


paymentRouter.post('/update', async (req, res, next) => {
    try {
        const validRequest = z.object({
            data: z.object({
                id: z.string(),
                customer_id: z.string(),
                subscription_id: z.string(),
                origin: z.string(),
                payments: z.array(z.object({
                    method_details:z.object({
                        card: z.object({
                            last4: z.string().nullable(),
                            cardholder_name: z.string().nullable(),
                            type: z.string().nullable()
    
                        }).nullable(),
                        type: z.string()
                    })
                }))
            })
        })
        const { data: {
            customer_id,
            subscription_id,
            payments,
            origin,
            id
        }

        } = validRequest.parse(req.body)
        if (origin == "subscription_payment_method_change") {
            await service.updatePayment({
                paddle_id: id,
                customer_id,
                subscription_id,
                card_brand: payments[0].method_details.card?.type ?? '',
                last4: payments[0].method_details.card?.last4 ?? '',
                card_name: payments[0].method_details.card?.cardholder_name ?? '',
                type: payments[0].method_details.type

            })
            return res.status(204).send()
        }
        return res.status(204).send({
            message: "Not applied"
        })
    } catch (error) {
        next(error);
    }
})


