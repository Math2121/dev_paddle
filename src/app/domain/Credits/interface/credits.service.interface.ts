export  type CreditData = {
    customer_id: string,
    transaction_id: string,
    billing_period: {
        ends_at: string,
    },
    monthly_minutes: string | number
    subscription_id: string
    product_name: string
    spent_amount?: string 
    
}
export type CreditUpdateData = {
    customer_id: string;
    monthly_minutes: string | number
    ends_at: string
    subscription_id:string
    name: string
}
export interface CreditsServiceInterface{
    registerCredit(values:CreditData):Promise<void>;
    updateCredit(values: CreditUpdateData): Promise<void>;
}