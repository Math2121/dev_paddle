import { Router } from 'express';
import { z } from 'zod';
import { CustomerServiceInterface } from '../../../../app/domain/Customer/interfaces/CustomerServiceInterface';
import { container } from '../../../library/inversify/inversify.config';
import { TYPES } from '../../../library/inversify/types';
import { customerPresenter } from '../../../../app/domain/Customer/presenter/customer.presenter';
import CustomerController from '../../../../app/controllers/customer.controller';
import verifyToken from './middleware/verifyToken';


export const customerRouter = Router();
const service = container.get<CustomerServiceInterface>(TYPES.CustomerServiceInterface)

const customerController = new CustomerController();
customerRouter.post('/webhook', async (req, res, next) => {
    try {
        const customer = await customerController.create(req.body);

        res.status(201).send(customer);
    } catch (error) {
        next(error)
    }
})

customerRouter.get('/', verifyToken, async (req, res, next) => {
    try {
        const token = req.headers.authorization ?? ''
        const customer = await customerController.retrieveInformationByCustomerId(token)
        res.status(200).send({
            data: {
                customer: customer
            }
        });
    } catch (error) {
        next(error)
    }
})

customerRouter.get('/invoices', verifyToken, async (req, res, next) => {
    try {
        const token = req.headers.authorization ?? ''
        const after = req.query.after as string
        const invoices = await customerController.getInvoicesByCustomer(token,after)
        res.status(200).send({
            data:
                customerPresenter.formatInvoices(invoices)

        });
    } catch (error) {
        next(error)
    }
})

customerRouter.get('/invoices/:transaction_id/document', verifyToken, async (req, res, next) => {
    try {
        const token = req.headers.authorization ?? ''
        const transaction_id = req.params.transaction_id
        const pdf = await customerController.getPDFByCustomer(token,transaction_id)
        res.status(200).send({
            data: {
                link: pdf
            }
        });
    } catch (error) {
        next(error)
    }
})


