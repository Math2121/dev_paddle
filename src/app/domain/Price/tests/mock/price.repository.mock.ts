import { Price as PricePrisma } from "@prisma/client";
import PriceRepositoryInterface from "../../repository/interface/price.interface";
import { RepositoryException } from "../../../../../utils/customExceptions";

export class PriceRepositoryMock implements PriceRepositoryInterface<PricePrisma> {
    getByProductId(id: string): Promise<PricePrisma | null> {
        throw new Error("Method not implemented.");
    }
    async create(entity: { id: string; amount: string; currency_code: string; status: string; paddle_id: string; }): Promise<void> {
        return
    }
    async find(id: string): Promise<PricePrisma | null> {
        if (!id) {
            throw new RepositoryException('Error finding Price')
        }
        return { id: 'teste', amount: '100', currency_code: 'USD', status: 'active', paddle_id: 'pri_teste', product_id: 'prod_teste' , custom_data: "teste", name: "Free"}


    }
    async update(id: string, entity: { id: string; amount: string; currency_code: string; status: string; paddle_id: string; }): Promise<void> {

        return
    }


}