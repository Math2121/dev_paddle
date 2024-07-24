import Product from "../model"
import{ Product as ProductPrisma }from '@prisma/client'
import { ProductWithPriceData } from "./ProductRepositoryInterface"
export type ProductCreateData = {
    name: string
    status: string
    paddle_id: string
}
export interface ProductServiceInterface {
    create(product: ProductCreateData): Promise<Product>
    update(product: any): Promise<void>
    find(id: string): Promise<ProductWithPriceData>
    getAll(): Promise<any[]>
    
}