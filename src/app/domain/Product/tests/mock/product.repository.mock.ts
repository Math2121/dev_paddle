import { ProductRepositoryInterface, ProductWithPriceData } from "../../interfaces/ProductRepositoryInterface";

export default class ProductRepositoryMock implements ProductRepositoryInterface {
    getWithPrice(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    get(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    async findWithPrice(id: string): Promise<ProductWithPriceData | null> {
        if (!id) {
            return null;
        }
        return Promise.resolve({ 
            name: 'teste',
            id: 'teste',
            paddle_id: 'pro_teste',
            price: [{ product_name: 'teste', currency: 'USD', amount: '10' }]
        });
    }
    async create(product: any): Promise<void> {
        return Promise.resolve()
    }
    async find(id: string): Promise<{ id: string; name: string; status: string; paddle_id: string; } | null> {
        if (!id) {
            return null;
        }
        return Promise.resolve({ id: 'teste', name: 'teste', status: 'active', paddle_id: 'pro_teste' })
    }
    async update(product: any): Promise<void> {
        if (!product.id) {
            throw new Error('Error finding Product')
        }
        return Promise.resolve()
    }

}