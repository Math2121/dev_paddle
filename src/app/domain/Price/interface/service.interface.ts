import Price from "../model";
import { PriceChangedData, PriceStoreData } from "../service";

export interface PriceServiceInterface {
    create(price: PriceStoreData): Promise<Price>
    changePriceData(price: PriceChangedData): Promise<void>
}