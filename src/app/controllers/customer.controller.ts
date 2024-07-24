import { z } from "zod";
import { container } from "../../infrastructure/library/inversify/inversify.config";
import { TYPES } from "../../infrastructure/library/inversify/types";

import { CustomerServiceInterface } from "../domain/Customer/interfaces/CustomerServiceInterface";


const service = container.get<CustomerServiceInterface>(TYPES.CustomerServiceInterface)


export default class CustomerController {

    async create(data: any): Promise<any> {

        const validObject = z.object({
            data: z.object({
                id: z.string(),
                email: z.string(),
                name: z.string().nullable(),
            })
        })

        const { data: { id, email, name } } = validObject.parse(data);
        return await service.create({ id, email, name });


    }

    async retrieveInformationByCustomerId(token: string): Promise<any> {

        const tokenValidate = z.string({
            required_error: "Token required",
            invalid_type_error: "Token must be a string"
        })

        const customer = tokenValidate.parse(token);
        return await service.retrieveInformationByCustomerId(customer);

    }

    async getInvoicesByCustomer(token: string, after:string): Promise<any> {

        const tokenValidate = z.string({
            required_error: "Token required",
            invalid_type_error: "Token must be a string"
        })

        const customer = tokenValidate.parse(token);
        return await service.getInvoices(customer,after);
    }

    async getPDFByCustomer(token: string, transaction_id:string): Promise<any> {
        const tokenValidate = z.string({
            required_error: "Token required",
            invalid_type_error: "Token must be a string"
        })
        const transaction_idValidate = z.string({
            required_error: "Transaction ID required",
            invalid_type_error: "Transaction ID  must be a string"
        })

        const customer = tokenValidate.parse(token);
        const transactionid = transaction_idValidate.parse(transaction_id);
        return await service.getPDF(customer,transactionid);
    }

}