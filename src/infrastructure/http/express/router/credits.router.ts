import { Router } from 'express';
import { z } from 'zod';

import { container } from '../../../library/inversify/inversify.config';
import { TYPES } from '../../../library/inversify/types';

import { CreditsServiceInterface } from '../../../../app/domain/Credits/interface/credits.service.interface';
import verifyOriginOfTransaction from './middleware/verifyOriginOfTransaction';


export const creditsRouter = Router();
const service = container.get<CreditsServiceInterface>(TYPES.CreditsServiceInterface)


creditsRouter.post('/webhook', verifyOriginOfTransaction, async (req, res, next) => {
    try {
        const validObject = z.object({
            data: z.object({
                customer_id: z.string(),
                id: z.string(),
                billing_period: z.object({
                    ends_at: z.string(),
                }),
                subscription_id: z.string(),
                items: z.array(
                    z.object({
                        price: z.object({
                            custom_data: z.object({
                                monthly_minutes: z.string(),

                            })
                        })
                    })
                ),
                details: z.object({
                    line_items: z.array(
                        z.object({
                            product: z.object({
                                name: z.string()
                            })
                        })
                    )
                })
            })
        })

        const { data: { customer_id, items, id, billing_period, subscription_id, details } } = validObject.parse(req.body);
        const monthly_minutes = items[0].price.custom_data.monthly_minutes



        await service.registerCredit({
            customer_id,
            monthly_minutes,
            transaction_id: id,
            billing_period,
            subscription_id,
            product_name: details.line_items[0].product.name,
        });

        res.status(204).send();
    } catch (error) {
        next(error)
    }
})



creditsRouter.post('/update/webhook', async (req, res, next) => {
    try {
        const validObject = z.object({
            data: z.object({
                customer_id: z.string(),
                origin: z.string(),
                billing_period: z.object({
                    ends_at: z.string(),
                }),
                subscription_id: z.string(),
                items: z.array(
                    z.object({
                        price: z.object({
                            custom_data: z.object({
                                monthly_minutes: z.string(),

                            })
                        })
                    })
                ),
                details: z.object({
                    line_items: z.array(
                        z.object({
                            product: z.object({
                                name: z.string()
                            })
                        })
                    )
                })
            })
        })

        const { data: { customer_id, items, billing_period, subscription_id, details, origin } } = validObject.parse(req.body);
        const monthly_minutes = items[0].price.custom_data.monthly_minutes

        if (origin === "subscription_update" || origin === "subscription_recurring") {
            await service.updateCredit({
                customer_id,
                monthly_minutes,
                ends_at: billing_period.ends_at,
                subscription_id,
                name: details.line_items[0].product.name,
            });

            res.status(204).send({
                "message": "Credit updated"
            });
        }

        res.status(200).send({
                "message": "Not apply for credits update"
        });
    } catch (error) {
        next(error)
    }
})

