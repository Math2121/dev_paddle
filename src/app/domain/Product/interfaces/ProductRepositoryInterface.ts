import { Product } from "@prisma/client"
export interface ProductWithPriceData {
    name: string;
    id: string;
    paddle_id: string;
    price: {
        product_name: string,
        currency: string
        amount: string
    }[]
}
export type ProductGetResponse = {
    id: string,
    name: string,
    paddle_id: string,
    status: string,
    price: {
        custom_data: string,
        amount: string,
        price_name: string,
        currency_code: string
    }[]

}
export interface ProductRepositoryInterface {

    create(product: any): Promise<void>

    find(id: string): Promise<Product | null>

    update(product: any): Promise<void>

    get(): Promise<ProductGetResponse[]>

    findWithPrice(id: string): Promise<ProductWithPriceData | null>
    getWithPrice(): Promise<any> 
}