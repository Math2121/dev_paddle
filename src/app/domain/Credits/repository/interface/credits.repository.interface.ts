export  type CreditData = {
    customer_id: string,
    billing_period: {
        ends_at: string,
    },
    monthly_minutes: string | number
    subscription_id: string
    product_name: string
    spent_amount?: string 
    
}
export interface CreditsRepositoryInterface{
    create(entity: CreditData): Promise<void>
    update(entity: any): Promise<void>
    selectCreditsByUser(customerId: string): Promise<any>
    selectCreditHistory(subscription_id: string, expiration_at: string): Promise<any>
}