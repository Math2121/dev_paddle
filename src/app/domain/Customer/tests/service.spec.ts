import "reflect-metadata"
import { Status } from "../../../../config/constants";
import { CustomerService } from "../service";
import { validate as uuidValidate } from 'uuid';
import MockCustomerRepository from "./mock/MockCustomerRepository";

import { MockApiService } from "./mock/MockApiService";
import { Customer } from "@prisma/client";
import { CustomerData } from "../interfaces/CustomerRepositoryInterface";



describe('Customer', () => {
    let customerService: CustomerService;
    const mockRepository = new MockCustomerRepository()
    const mockApiService = new MockApiService()
    const customerRequest = {
        id: 'ctm_teste',
        name: "teste",
        email: "johndoe@example.com",
        status: Status.ACTIVE
    };


    beforeEach(() => {
        customerService = new CustomerService(mockRepository, mockApiService);
    });

    it('should create a customer', async () => {
        mockRepository.findCustomerByPaddleId = async (id: string): Promise<CustomerData | null> => {
            return null
        }
        customerService = new CustomerService(mockRepository, mockApiService);
        const createdCustomer = await customerService.create(customerRequest);

        expect(createdCustomer.email).toEqual('johndoe@example.com');
        expect(createdCustomer.name).toEqual('John Doe');
        expect(uuidValidate(createdCustomer.id)).toBe(true)
    })

    it('should not possibly create a customer when it already exists', async () => {
        mockRepository.findCustomerByPaddleId = async (id: string): Promise<CustomerData | null> => {
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
        const customerServiceWithError = new CustomerService(mockRepository, mockApiService);
        await expect(customerServiceWithError.create(customerRequest)).rejects.toThrow("Customer already exists");

    })


    it('should return customer information', async () => {
        mockRepository.findCustomerByPaddleId = async (id: string): Promise<CustomerData | null> => {
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
        const customerService = new CustomerService(mockRepository, mockApiService);
        expect(async () => {
            await customerService.retrieveInformationByCustomerId('ctm_teste')
        }).not.toThrow();
    })

    it('should not return customer information wiht token invalid', async () => {
        expect(async () => {
           await customerService.retrieveInformationByCustomerId('')
        }).rejects.toThrow("Invalid token");
    })

    it('should not return customer information with no customer', async () => {
        mockRepository.getEmailByToken = async (id: string): Promise<CustomerData | null> => {
            return {
                customer_id: '',
                customer_name: '',
                customer_email: '',
                customer_status: '',
                subscription_id: '',
                subscription_status: '',
                price_id: '',
                amount: '',
                currency: '',
                product_id: '',
                product_name: '',
                product_status: ''
            }
        }

        mockRepository.findCustomerByEmail =   async (id: string): Promise<CustomerData | null> => {
            return null
        }

        expect(async () => {
           await customerService.retrieveInformationByCustomerId('abc')
        }).rejects.toThrow("Customer not found");
    })
});
