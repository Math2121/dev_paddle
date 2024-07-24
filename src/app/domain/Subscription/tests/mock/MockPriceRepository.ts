

import { Price } from "@prisma/client";
import PriceRepositoryInterface from "../../../Price/repository/interface/price.interface";

export class MockPriceRepository implements PriceRepositoryInterface<Price> {


    prices: Price[] = [
        {
            id: "1",
            amount: "100",
            currency_code: "USD",
            status: "active",
            paddle_id: "pri_teste",
            product_id: "pro_teste",
            custom_data: "TESTE",
            name: "teste"
        },
        {
            id: "2",
            amount: "200",
            currency_code: "USD",
            status: "active",
            paddle_id: "pri_teste2",
            product_id: "pro_teste",
            custom_data: "TESTE",
            name: "teste"
        },
        {
            id: "3",
            amount: "400",
            currency_code: "BRL",
            status: "active",
            paddle_id: "pri_teste3",
            product_id: "pro_teste",
            custom_data: "TESTE",
            name: "teste"
        }
    ]
    async create(entity: { id: string; amount: string; currency_code: string; status: string; paddle_id: string; }): Promise<void> {
        return
    }
    async find(id: string): Promise<Price | null> {
        return this.prices.find(price => price.paddle_id === id) ?? null
    }
    async update(id: string, entity: { id: string; amount: string; currency_code: string; status: string; paddle_id: string; }): Promise<void> {
        return
    }
    getByProductId(id: string): Promise<Price | null> {
        throw new Error("Method not implemented.");
    }

}