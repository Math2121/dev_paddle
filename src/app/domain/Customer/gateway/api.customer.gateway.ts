import { injectable } from "inversify";
import { instanceOfAxios } from "../../../../infrastructure/library/axios";
import { API_URL_CONSULT } from "../../../../config/constants";
import { ApiCustomerGatewayInterface, InvoiceLinkResponse, InvoicesData } from "./interface/api.customer.gateway.interface";

@injectable()
export class ApiCustomerGateway implements ApiCustomerGatewayInterface {
    async fetchPDFInvoice(transaction_id: string): Promise<InvoiceLinkResponse> {
        try {

            const link = await instanceOfAxios.get<InvoiceLinkResponse>(`${API_URL_CONSULT.TRANSACTIONS}/${transaction_id}/invoice`);

            return link.data;

        } catch (error: any) {
            throw new Error('Link not found')
        }
    }
    async fetchCustomerInvoices(customer_id: string, after: string): Promise<InvoicesData> {
        try {
            let afterUrl = after ? `&after=${after}` : ''
            const customer = await instanceOfAxios.get<InvoicesData>(`${API_URL_CONSULT.TRANSACTIONS}?customer_id=${customer_id}&per_page=1${afterUrl}`);

            return customer.data;
        } catch (error: any) {
            throw new Error(error)
        }
    }

}