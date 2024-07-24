
import { Price } from "@prisma/client";
import PriceRepositoryInterface from "../interface/price.interface";
import { prisma } from "../../../../../infrastructure/database/prisma/instanceOfPrisma";
import { RepositoryException } from "../../../../../utils/customExceptions";
import { injectable, multiInject } from "inversify";
import { Observer } from "../../../../observers/interface/IObserver";

export type PriceDataUpdate = {
    id: string
    amount?: string;
    currency_code?: string;
    status?: string
    name?: string;
    custom_data?: string
    product_id?: string
}
@injectable()
export default class PriceRepository implements PriceRepositoryInterface<Price> {
    private observers: Observer[];
    constructor(@multiInject('PriceObserver') observers: Observer[]) {
        this.observers = observers;
    }
    async getByProductId(id: string): Promise<Price | null> {
        try {
            return await prisma.price.findFirst({ where: { product_id: id } })
        } catch (error) {
            throw new RepositoryException(`Error get Price: ${error}`);
        }
    }
    async update(id: string, entity: PriceDataUpdate): Promise<void> {

        try {
            await prisma.price.update({
                where: { paddle_id: id },
                data: {
                    amount: entity.amount,
                    currency_code: entity.currency_code,
                    status: entity.status,
                    name: entity.name,
                    custom_data: entity.custom_data,
                    product_id: entity.product_id
                }
            })
            await this.notifyUpdated(`New Price update successfully object: ${JSON.stringify(entity)}`)
        } catch (error) {
            throw new RepositoryException(`Error updating Price: ${error}`);
        }
    }
    async create(entity: Price): Promise<void> {
        try {
            await prisma.price.create({
                data: {
                    id: entity.id,
                    amount: entity.amount,
                    status: entity.status,
                    currency_code: entity.currency_code,
                    paddle_id: entity.paddle_id,
                    product_id: entity.product_id,
                    custom_data: entity.custom_data,
                    name: entity.name,
                }
            })
            this.notifyCreated(`New Price created successfully ID: ${entity.id}`)
        } catch (error) {
            throw new RepositoryException(`Error creating Price: ${error}`);
        }


    }
    async find(id: string): Promise<Price | null> {
        try {
            return await prisma.price.findUnique({ where: { paddle_id: id } })
        } catch (error) {
            throw new RepositoryException(`Error finding Price`);
        }
    }

    private async notifyCreated(value: string) {
        for (const observer of this.observers) {
            await observer.created(value);
        }
    }
    private async notifyUpdated(value: string) {
        for (const observer of this.observers) {
            await observer.updated(value);
        }
    }

}