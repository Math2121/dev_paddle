
import { Customer } from "../model";
import { CustomerRequestDTO } from "./CustomerServiceInterface";


export interface CustomerData {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_status: string;
    subscription_id: string;
    subscription_status: string;
    price_id: string;
    amount: string;
    currency: string;
    product_id: string;
    product_name: string;
    product_status: string;
}


export interface CustomerRepositoryInterface<T> {
    create(newCustomer: CustomerRequestDTO): Promise<T>
    findCustomerByEmail(email: string): Promise<CustomerData | null>
    findCustomerByPaddleId(id: string): Promise<CustomerData | null>
    updateStatus(customer: Customer): Promise<void>
    getEmailByToken(token: string): Promise<any> 
    getUserIdByEmail(email: string): Promise<any> 
}