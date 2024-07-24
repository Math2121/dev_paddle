import "reflect-metadata"
import PriceRepositoryInterface from "../repository/interface/price.interface"
import PriceService from "../service"
import { Price as PricePrisma } from "@prisma/client";
import { PriceRepositoryMock } from "./mock/price.repository.mock";
import { PriceServiceInterface } from "../interface/service.interface";
describe('Price Service', () => {
    let service: PriceServiceInterface
    let priceRepository: PriceRepositoryInterface<PricePrisma>
    beforeEach(() => {
        priceRepository = new PriceRepositoryMock()
        service = new PriceService(priceRepository)
    })

    it('should create price', async () => {
        const newPrice = await service.create({
            amount: "100",
            status: 'active',
            currency_code: 'USD', 
            paddle_id: 'pri_teste', 
            product_id: 'prod_teste', 
            name: "Free",
            custom_data: { monthly_minutes: '255', storage_gb: "25255", upload_max_length_minutes: "55" }
        })
        expect(newPrice.amount).toBe("100")
    })


    it('should change price data', async () => {

        let repositorySpyFind = jest.spyOn(priceRepository, 'find')
        let repositorySpyUpdate = jest.spyOn(priceRepository, 'update')
        await service.changePriceData({ id: 'teste', amount: "100", status: 'active', currency_code: 'USD', paddle_id: 'pri_teste' })

        expect(repositorySpyFind).toHaveBeenCalled()
        expect(repositorySpyUpdate).toHaveBeenCalled()
    })
    it('should not update price data', () => {

        let repositorySpyFind = jest.spyOn(priceRepository, 'find')

        expect(async () => {
            await service.changePriceData({ id: '', amount: "100", status: 'active', currency_code: 'USD', paddle_id: 'pri_teste' })
        }).rejects.toThrow("Error finding Price")
        expect(repositorySpyFind).toHaveBeenCalled()
    })

})