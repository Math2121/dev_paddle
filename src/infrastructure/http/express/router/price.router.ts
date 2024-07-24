import { Router } from 'express';
import { z } from 'zod';


import { TYPES } from '../../../library/inversify/types';
import { PriceServiceInterface } from '../../../../app/domain/Price/interface/service.interface';
import { container } from '../../../library/inversify/inversify.config';


export const priceRouter = Router();
const service = container.get<PriceServiceInterface>(TYPES.PriceServiceInterface)


priceRouter.post('/create', async (req, res, next) => {
    try {
        const validObject = z.object({
            data: z.object({
                id: z.string(),
                name: z.string(),
                status: z.string(),
                unit_price: z.object({
                    amount: z.string(),
                    currency_code: z.string()
                }),
                product_id: z.string(),
                custom_data: z.object({
                    monthly_minutes: z.string(),
                    storage_gb: z.string(),
                    upload_max_length_minutes: z.string(),
                })
            })
        })

        const { data: { id, status, unit_price: { amount, currency_code }, product_id, name } } = validObject.parse(req.body);
        const price = await service.create({
            amount,
            currency_code,
            paddle_id: id,
            status,
            product_id,
            custom_data: {
                monthly_minutes: req.body.data.custom_data.monthly_minutes,
                storage_gb: req.body.data.custom_data.storage_gb,
                upload_max_length_minutes: req.body.data.custom_data.upload_max_length_minutes,
            },
            name
        });

        res.status(201).send(price);
    } catch (error) {
        next(error)
    }
})


priceRouter.post('/update', async (req, res, next) => {
    try {
        const validObject = z.object({
            data: z.object({
                id: z.string(),
                status: z.string(),
                name: z.string(),
                product_id: z.string(),
                custom_data: z.unknown(),
                unit_price: z.object({
                    amount: z.string(),
                    currency_code: z.string(),
                })
            })
        })

        const { data: { status, name, product_id, id, unit_price: { amount, currency_code }, custom_data } } = validObject.parse(req.body);
        await service.changePriceData({
            id,
            amount,
            currency_code,
            status,
            product_id,
            custom_data,
            name: name
        });

        res.status(200).send({
            message: "Price updated"
        });
    } catch (error) {
        next(error)
    }
})


