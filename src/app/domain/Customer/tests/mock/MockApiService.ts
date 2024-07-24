import { ApiCustomerGatewayInterface, InvoiceLinkResponse, InvoicesData } from "../../gateway/interface/api.customer.gateway.interface";

export class MockApiService implements ApiCustomerGatewayInterface {
    async fetchCustomerInvoices(customer_id: string, after: string): Promise<InvoicesData> {
        return {
            data: {
                id: 'teste',
                status: 'teste',
                currency_code: 'teste',
                billing_period: {
                    starts_at: 'teste',
                    ends_at: 'teste',
                },
                items: [{
                    price: {
                        description: 'teste',
                        billing_cycle: {
                            interval: 'teste',
                            frequency: 1,
                        },
                        unit_price: {
                            amount: 'teste',
                            currency_code: 'teste',
                        }
                    }
                }],
                details: {
                    line_items: {
                        product: {
                            name: 'teste',
                            description: 'teste',
                        }
                    }
                }
            },
            meta: {
                pagination: {
                    has_more: true,
                    next: 'teste'
                }
            }
        }
    }
    async fetchPDFInvoice(transaction_id: string): Promise<InvoiceLinkResponse> {
        return {
            data: {
                url: 'teste'
            }
        };
    }

}