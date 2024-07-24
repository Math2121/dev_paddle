import { Router } from 'express';
import { z } from 'zod';
import { container } from '../../../library/inversify/inversify.config';
import { TYPES } from '../../../library/inversify/types';
import { SubscriptionServiceInterface } from '../../../../app/domain/Subscription/interfaces/SubscriptionServiceInterface';


export const subscriptionRouter = Router();
const service = container.get<SubscriptionServiceInterface>(TYPES.SubscriptionServiceInterface)

subscriptionRouter.patch('/changePlan/:customer_id', async (req, res, next) => {

    const requestBody = z.object({
        items: z.object({
            price_id: z.string()
        }),
    })
    try {
        const { items } = requestBody.parse(req.body)
        const { customer_id } = req.params
        const subscriptionChanged = await service.changePlan(customer_id, items.price_id);

        res.status(200).send({
            message: "Process subscription changed started",
            data: subscriptionChanged
        });
    } catch (error) {
        next(error)
    }

})

subscriptionRouter.post('/pause/renovation/:customer_id', async (req, res, next) => {
    const requestParams = z.object({
        customer_id: z.string(),
    })
    try {
        const { customer_id } = requestParams.parse(req.params)
        await service.pauseRenovation(customer_id);

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})


subscriptionRouter.post('/resume/renovation/:customer_id', async (req, res, next) => {
    const requestParams = z.object({
        customer_id: z.string(),
    })
    try {
        const { customer_id } = requestParams.parse(req.params)
        await service.resumeRenovation(customer_id);

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

subscriptionRouter.post('/create', async (req, res, next) => {
    const validObject = z.object({
        data: z.object({
            customer_id: z.string(),
            id: z.string(),
            status: z.string(),
            transaction_id: z.string(),
            next_billed_at:z.string(),
            items: z.array(
                z.object({
                    price: z.object({
                        id: z.string(),
                        unit_price: z.object({
                            amount: z.string(),
                            currency_code: z.string()
                        }),
                        product_id: z.string(),
                        custom_data: z.object({
                            monthly_minutes: z.string(),
                            
                        })
                    }),
                    recurring: z.boolean(),
                })
            ),
        })
    })
    try {
        const { data: { customer_id, id, items, status} } = validObject.parse(req.body)

        const subscription = await service.createSubscription({
            customer_id: customer_id,
            paddle_id: id,
            price_id: items[0].price.id,
            product_id: items[0].price.product_id,
            status: status
        });
        res.status(201).send({
            message: 'Subscription created',
            data: subscription
        });
    } catch (error) {
        next(error)
    }

})