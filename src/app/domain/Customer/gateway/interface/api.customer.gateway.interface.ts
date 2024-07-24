export type InvoicesData = {
    data: {
        id:string
        status: string,
        currency_code: string,
        billing_period: {
            starts_at: string,
            ends_at: string,
        },
        items: {
            price: {
                description: string,
                billing_cycle: {
                    interval: string,
                    frequency: number,

                },
                unit_price: {
                    amount: string,
                    currency_code: string,
                }
            }
        }[],
        details: {
            line_items: {
                product: {
                    name: string,
                    description: string,

                }
            }
        }
    },
    meta: {
        pagination: {
            has_more: boolean,
            next: string
        }
    }
}

export type InvoiceLinkResponse = {
    data: {
        url: string
    }
}
export interface ApiCustomerGatewayInterface {
    fetchCustomerInvoices(customer_id: string,after:string): Promise<InvoicesData>
    fetchPDFInvoice(transaction_id: string): Promise<InvoiceLinkResponse>
}