interface Subscription {
    subscription_id: string;
    subscription_status: string;
}
interface Price {
    price_id: string;
    amount: string;
    currency: string;
}
interface Product {
    product_id: string;
    product_name: string;
    product_status: string;
}
interface CustomerDTO {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_status: string;
    subscription: Subscription
    price: Price
    product: Product
}

interface CustomerData {
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
interface Invoice {
    data: {
        id: string;
        status: string;
        customer_id: string;
        address_id: string | null;
        business_id: string | null;
        custom_data: any | null; // Can be more specific if you know the data structure
        origin: string;
        collection_mode: string;
        subscription_id: string;
        invoice_id: string | null;
        invoice_number: string | null;
        billing_details: any | null;
        billing_period: {
            starts_at: string;
            ends_at: string;
        };
        currency_code: string;
        discount_id: string | null;
        created_at: string;
        updated_at: string;
        billed_at: string;
        items: InvoiceItem[];
        details: InvoiceDetails;
        payments: InvoicePayment[];
        checkout: {
            url: string;
        };
        receipt_data: any | null;
    }[],
    meta: {
        pagination: {
            has_more: boolean;
            next: string;
            estimated_total: number;
        }
    }
}
interface InvoiceItem {
    price: PriceInvoice;
    quantity: number;
    proration?: {
        rate: string;
        billing_period: {
            starts_at: string;
            ends_at: string;
        };
    };
}

interface PriceInvoice {
    id: string;
    description: string;
    type: string;
    name: string | null;
    product_id: string;
    billing_cycle: {
        interval: string;
        frequency: number;
    };
    trial_period: any | null; // Can be more specific if you know the data structure
    tax_mode: string;
    unit_price: {
        amount: string;
        currency_code: string;
    };
    unit_price_overrides: any[]; // Can be more specific if you know the data structure
    custom_data: any | null; // Can be more specific if you know the data structure
    quantity: {
        minimum: number;
        maximum: number;
    };
    status: string;
    created_at: string;
    updated_at: string;
}

interface InvoiceDetails {
    tax_rates_used: TaxRate[];
    totals: InvoiceTotals;
    adjusted_totals: InvoiceTotals;
    payout_totals: InvoiceTotals;
    adjusted_payout_totals: InvoiceAdjustedPayoutTotals;
    line_items: InvoiceLineItem[];
}

interface TaxRate {
    tax_rate: string;
    totals: InvoiceTotals;
}

interface InvoiceTotals {
    subtotal: string;
    tax: string;
    discount: string;
    total: string;
    grand_total: string;
    fee: string;
    credit: string;
    credit_to_balance: string;
    balance: string;
    earnings: string;
    currency_code: string;
}

interface InvoiceAdjustedPayoutTotals extends InvoiceTotals {
    chargeback_fee: {
        amount: string;
        original: any | null; // Can be more specific if you know the data structure
    };
}

interface InvoiceLineItem {
    id: string;
    price_id: string;
    quantity: number;
    totals: InvoiceTotals;
    product: ProductInvoice;
    tax_rate: string;
    unit_totals: InvoiceTotals;
    proration?: {
        rate: string;
        billing_period: {
            starts_at: string;
            ends_at: string;
        };
    };
}

interface ProductInvoice {
    id: string;
    name: string;
    description: string;
    type: string;
    tax_category: string;
    image_url: string;
    custom_data: any | null; // Can be more specific if you know the data structure
    status: string;
    created_at: string;
    updated_at: string;
}
interface InvoicePayment {
    // You'll need to define the properties for the payment object based on your data structure
}

export const customerPresenter = {
    formatCustomer(customer: CustomerData): CustomerDTO {
        return {
            customer_id: customer.customer_id,
            customer_name: customer.customer_name,
            customer_email: customer.customer_email,
            customer_status: customer.customer_status,
            subscription: {
                subscription_id: customer.subscription_id,
                subscription_status: customer.subscription_status
            },
            price: {
                price_id: customer.price_id,
                amount: customer.amount,
                currency: customer.currency
            },
            product: {
                product_id: customer.product_id,
                product_name: customer.product_name,
                product_status: customer.product_status
            }
        }
    },

    formatInvoices(invoices: Invoice) {
        let isMoreInvoice = invoices.meta.pagination.has_more
        let estimated = invoices.meta.pagination.estimated_total

        let next = null
        if (isMoreInvoice && estimated > 1) {
            let lastTransactionId = invoices.data[invoices.data.length - 1]
            next = lastTransactionId.id

        }
        return {
            invoice: invoices.data.map((invoice: any) => {
                return {
                    invoice_id: invoice.id,
                    invoice_status: invoice.status,
                    amount: invoice.amount,
                    currency: invoice.currency,
                    billing_period: {
                        starts_at: invoice.billing_period.starts_at,
                        ends_at: invoice.billing_period.ends_at,
                    },
                    created_at: invoice.created_at,
                    product: {
                        name: invoice.details.line_items[0].product.name,
                        price: {
                            amount: invoice.items[0].price.unit_price.amount,
                            currency_code: invoice.items[0].price.unit_price.currency_code,
                        }
                    }
                }
            }),
            meta: {
                pagination: {
                    next: next
                }
            }
        }
    }
}