import { Status } from "../../../../config/constants";

import { InvoiceLinkResponse, InvoicesData } from "../gateway/interface/api.customer.gateway.interface";
import { CustomerData } from "./CustomerRepositoryInterface";

export type CustomerRequest = {
    id: string,
    email: string,
    name: string | null,
}


export interface CustomerRequestDTO {
    id: string
    name: string
    email: string
    paddle_id: string
    status: Status
}


export interface CustomerResponseDTO {
    id: string,
    name: string | null,
    email: string,
    status: string
}



export interface CustomerServiceInterface {
    create(customer: CustomerRequest): Promise<CustomerResponseDTO>
    changeStatusOfCustomer(status: Status, customerId: string): Promise<void>,
    retrieveInformationByCustomerId(customerId: string): Promise<CustomerData>
    getInvoices(token: string,after:string): Promise<InvoicesData>
    getPDF(token: string, transaction_id:string): Promise<InvoiceLinkResponse>

}