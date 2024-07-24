
import { inject, injectable } from "inversify";

import { CustomerRequest, CustomerResponseDTO, CustomerServiceInterface } from "./interfaces/CustomerServiceInterface";
import { Customer } from "./model";
import { Customer as CustomerPrimsa } from "@prisma/client";
import { CustomerData, CustomerRepositoryInterface } from "./interfaces/CustomerRepositoryInterface";
import { TYPES } from "../../../infrastructure/library/inversify/types";
import { Status } from "../../../config/constants";
import { ServiceException } from "../../../utils/customExceptions";
import { throwServiceException } from "../../../utils/commonUtils";
import { awsLogger } from "../../../infrastructure/library/awsLogger";
import { ApiCustomerGatewayInterface, InvoiceLinkResponse, InvoicesData } from "./gateway/interface/api.customer.gateway.interface";


@injectable()

export class CustomerService implements CustomerServiceInterface {

    constructor(
        @inject(TYPES.CustomerRepositoryInterface) private customerRepository: CustomerRepositoryInterface<CustomerPrimsa>,
        @inject(TYPES.ApiServiceInterface) private apiService: ApiCustomerGatewayInterface) {
    }
    async getPDF(token: string,transaction_id:string): Promise<InvoiceLinkResponse> {
        try {
            const customerEmail = await this.customerRepository.getEmailByToken(token);

            const customer = await this.customerRepository.findCustomerByEmail(customerEmail);

            if (!customer) {
                throw new ServiceException("Customer not found");
            }
            const pdfLink = await this.apiService.fetchPDFInvoice(transaction_id);
            return pdfLink

        } catch (error:any) {
            throwServiceException(error)
        }
    }
    async getInvoices(token: string,after:string): Promise<InvoicesData> {
        
        try {
            const customerEmail = await this.customerRepository.getEmailByToken(token);

            const customer = await this.customerRepository.findCustomerByEmail(customerEmail);

            if (!customer) {
                throw new ServiceException("Customer not found");
            }
            const customerInvoices = await this.apiService.fetchCustomerInvoices(customer.customer_id,after);

            return customerInvoices

        } catch (error:any) {
            throwServiceException(error)
        }

    }
    async retrieveInformationByCustomerId(customerId: string): Promise<CustomerData> {

        try {
            const customerEmail = await this.customerRepository.getEmailByToken(customerId);
            if (!customerEmail) {
                throw new ServiceException("Invalid token")
            }

            const customer = await this.customerRepository.findCustomerByEmail(customerEmail);
            if (customer) {
                return customer
            }
            throw new ServiceException("Customer not found");
        } catch (error:any) {
            throwServiceException(error)
        }
    }

    async create(customer: CustomerRequest): Promise<CustomerResponseDTO> {
        try {
            const { name, email, id } = customer;
            const existingCustomer = await this.customerRepository.findCustomerByPaddleId(id);

            if (!existingCustomer) {
                const customer = Customer.createCustomer(name ?? ' ', email, Status.ACTIVE);
                return this.customerRepository.create({
                    name: customer.name,
                    id: customer.id,
                    email: customer.email,
                    status: customer.status as Status,
                    paddle_id: id,
                });
            }
            throw new ServiceException("Customer already exists");
        } catch (error: any) {
            awsLogger.info(JSON.stringify(error))
            throwServiceException(error)
        }
    }


    async changeStatusOfCustomer(customerId: string, status: Status) {

        try {
            const customerFound = await this.customerRepository.findCustomerByPaddleId(customerId)

            if (!customerFound) {
                throw new ServiceException("Customer not found");
            }

            let customer = new Customer(
                customerFound.customer_name ?? '',
                customerFound.customer_email,
                customerFound.customer_status as Status
            )

            customer.changeStatus(status);

            this.customerRepository.updateStatus(customer)
        } catch (error:any) {
            throwServiceException(error)
        }
    }

}