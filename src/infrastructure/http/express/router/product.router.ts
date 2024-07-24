import { Router } from 'express';
import { z } from 'zod';
import { TYPES } from '../../../library/inversify/types';
import { container } from '../../../library/inversify/inversify.config';
import { ProductServiceInterface } from '../../../../app/domain/Product/interfaces/ProductServiceInterface';


export const productRouter = Router();
const service = container.get<ProductServiceInterface>(TYPES.ProductServiceInterface)


productRouter.post('/create', async (req, res, next) => {
    try {
        const validObject = z.object({
            data: z.object({
                id: z.string(),
                name: z.string(),
                status: z.string()
            })
        })

        const { data: { id, status, name } } = validObject.parse(req.body);
        const product = await service.create({
            paddle_id: id, status, name
        });

        res.status(201).send(product);
    } catch (error) {
        next(error)
    }
})


productRouter.post('/update', async (req, res, next) => {
    try {
        const validObject = z.object({
            data: z.object({
                id: z.string(),
                name: z.string(),
                status: z.string()
            })
        })

        const { data: { id, status, name } } = validObject.parse(req.body);
        await service.update({
            paddle_id: id, status, name
        });

        res.status(200).send({
            message: 'Product updated'
        });
    } catch (error) {
        next(error)
    }
})


productRouter.get('/:product_id', async (req, res, next) => {
    try {
        const {product_id} = req.params 

        const product = await service.find(product_id);

        res.status(200).send(product);
    } catch (error) {
        next(error)
    }
})


productRouter.get('/', async (req, res, next) => {
    try {
   
        const products = await service.getAll();

        res.status(200).send(products);
    } catch (error) {
        next(error)
    }
})

