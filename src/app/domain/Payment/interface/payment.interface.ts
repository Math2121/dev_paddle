export interface InputPaymentDto {
    type: string;
    card_brand: string | null;
    customer_id: string;
    subscription_id: string;
    card_name: string | null;
    last4: string | null;
    paddle_id: string
}

export interface OutPutPaymentDto {
    type: string;
    card_brand: string | null;
    card_name: string | null;
    last4: string | null;
}

export interface InputPaymentUpdateDto {
    paddle_id:string;
    type: string;
    card_brand: string | null;
    customer_id: string;
    subscription_id: string;
    card_name: string | null;
    last4: string | null;
}

export interface PaymentRepositoryInterface<T> {
    create(input: InputPaymentDto): Promise<void>
    update(input: InputPaymentUpdateDto): Promise<void>
    find(paddle_id:string): Promise<T|null>
}

export interface PaymentServiceInterface {
    createPayment(data: InputPaymentDto): Promise<OutPutPaymentDto>
    updatePayment(data: InputPaymentUpdateDto): Promise<void>
}