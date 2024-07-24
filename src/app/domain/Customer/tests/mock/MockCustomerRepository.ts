import { Customer as CustomerPrisma } from "@prisma/client";

import { Customer } from "../../model";
import { CustomerData, CustomerRepositoryInterface } from "../../interfaces/CustomerRepositoryInterface";
import { Status } from "../../../../../config/constants";
import { v4 as uuidv4 } from 'uuid';
import { CustomerRequestDTO } from "../../interfaces/CustomerServiceInterface";
class MockCustomerRepository implements CustomerRepositoryInterface<CustomerPrisma> {
    async getUserIdByEmail(email: string): Promise<any> {
        return "abc"
    }
    async findCustomerByEmail(email: string): Promise<CustomerData | null> {
        if(!email) return null;
        return {
            customer_id: 'ctm_teste',
            customer_name: 'teste',
            customer_email: 'teste@gmail.com',
            customer_status: 'active',
            subscription_id: 'sub_id',
            subscription_status: 'active',
            price_id: 'pri_teste',
            amount: '25000',
            currency: 'USD',
            product_id: 'pro_teste',
            product_name: 'product 1',
            product_status: 'active'
        }
    }
    async getEmailByToken(token: string): Promise<any> {
        if(!token) return null;
        return {
            customer_id: 'ctm_teste',
            customer_name: 'teste',
            customer_email: 'teste@gmail.com',
            customer_status: 'active',
            subscription_id: 'sub_id',
            subscription_status: 'active',
            price_id: 'pri_teste',
            amount: '25000',
            currency: 'USD',
            product_id: 'pro_teste',
            product_name: 'product 1',
            product_status: 'active'
        }
    }
    async create(newCustomer: CustomerRequestDTO): Promise<CustomerPrisma> {

        return {
            id: uuidv4(),
            name: 'John Doe',
            email: 'johndoe@example.com',
            status: Status.ACTIVE,
            createdAt: new Date(Date.UTC(2022, 1, 1)),
            updatedAt: new Date(Date.UTC(2022, 1, 1)),
            paddle_id: 'cm_teste',
        }
    }

    async findCustomerByPaddleId(id: string): Promise<CustomerData | null> {
        if (!id) {
            return null
        }
        return {
            customer_id: 'ctm_teste',
            customer_name: 'teste',
            customer_email: 'teste@gmail.com',
            customer_status: 'active',
            subscription_id: 'sub_id',
            subscription_status: 'active',
            price_id: 'pri_teste',
            amount: '25000',
            currency: 'USD',
            product_id: 'pro_teste',
            product_name: 'product 1',
            product_status: 'active'
        }
    }


    async updateStatus(customer: Customer): Promise<void> {
        // Implement the updateStatus method mock
        // Perform necessary actions to update the customer's status
    }
}

export default MockCustomerRepository;