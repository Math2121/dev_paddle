import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/library/inversify/types";
import PriceRepositoryInterface from "./repository/interface/price.interface";
import { Price as PricePrisma } from "@prisma/client";
import Price from "./model";
import { throwServiceException } from "../../../utils/commonUtils";
import { PriceServiceInterface } from "./interface/service.interface";
import { ServiceException } from "../../../utils/customExceptions";

export type PriceStoreData = {
    amount: string;
    currency_code: string;
    name: string;
    status: string
    paddle_id: string
    custom_data: any
    product_id: string
}
export interface PriceChangedData extends Partial<PriceStoreData> { id: string }
@injectable()
export default class PriceService implements PriceServiceInterface {
    constructor(@inject(TYPES.PriceRepositoryInterface) private priceRepository: PriceRepositoryInterface<PricePrisma>) {

    }

    async create(price: PriceStoreData): Promise<Price> {
        try {
            const newPrice = new Price(
                price.amount,
                price.currency_code,
                price.paddle_id,
                price.status,
                price.product_id,
                price.name
            )

            await this.priceRepository.create({
                id: newPrice.id,
                amount: newPrice.amount,
                currency_code: newPrice.currency_code,
                paddle_id: newPrice.paddle_id,
                status: newPrice.status,
                product_id: newPrice.product_id,
                custom_data: JSON.stringify(price.custom_data),
                name: newPrice.name,
            })
            return newPrice
        } catch (error: any) {
            throwServiceException(error)
        }
    }

    async changePriceData(price: PriceChangedData): Promise<void> {

        try {
            const priceExist = await this.priceRepository.find(price.id)
            if (priceExist) {
                const priceEntity = new Price(
                    price.amount ?? priceExist.amount,
                    price.currency_code ?? priceExist.currency_code,
                    price.paddle_id ?? priceExist.paddle_id,
                    price.status ?? priceExist.status,
                    price.product_id ?? priceExist.product_id,
                    price.name ?? priceExist.name)

                if (price?.amount) {
                    priceEntity.alterPrice(price.amount)
                }
                if (price?.status === 'archived') {
                    priceEntity.deactivate()
                }
                if (price?.currency_code) {
                    priceEntity.changeCurrency(price.currency_code)
                }

                await this.priceRepository.update(priceExist.paddle_id, {
                    id: priceExist.id,
                    amount: priceEntity.amount,
                    currency_code: priceEntity.currency_code,
                    paddle_id: priceEntity.paddle_id,
                    status: priceEntity.status,
                    product_id: priceEntity.product_id,
                    name: priceEntity.name,
                    custom_data: JSON.stringify(price.custom_data),
                })
                return
            }
            throw new ServiceException(`Price with id ${price.id} not found`)

        } catch (error: any) {
            throwServiceException(error)
        }
    }
}