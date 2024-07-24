import "reflect-metadata"
import { ProductRepositoryInterface } from "../interfaces/ProductRepositoryInterface"

import ProductService from "../service"
import ProductRepositoryMock from "./mock/product.repository.mock"
import { ApiProductGateway } from "../gateway/product.gateway"
import MockApiProductGateway from "./mock/api.product.gateway.mock"
import { ApiProductGatewayInterface } from "../gateway/interface/api.product.gateway.interface"

describe('Product Service', () => {

    let service: ProductService
    let productRepositoryMock: ProductRepositoryInterface
    let apiProductGateway: ApiProductGatewayInterface

    beforeEach(() => {
        productRepositoryMock = new ProductRepositoryMock()
        apiProductGateway = new MockApiProductGateway()
        service = new ProductService(apiProductGateway, productRepositoryMock)
    })

    it('should create product', async () => {
        const newProduct = await service.create({ name: 'teste', status: 'active', paddle_id: 'pro_teste' })
        expect(newProduct.name).toBe('teste')
    })

    it('should not create product without name', () => {
        expect(async () => await service.create({ name: '', status: 'active', paddle_id: 'pro_teste' })).rejects.toThrow('Product name is required')
    })

    it('should not create product without status', async () => {
        expect(() => service.create({ name: 'teste', status: '', paddle_id: 'pro_teste' })).rejects.toThrow('Product status is required')
    })

    it('should not create product without paddle_id', async () => {
        expect(() => service.create({ name: 'teste', status: 'active', paddle_id: '' })).rejects.toThrow('Product paddle_id is required')
    })

    it('should not update product', async () => {
        expect(async () => await service.update({ id: 'teste', name: 'teste', status: 'active', paddle_id: '' })).rejects.toThrow(('Error finding Product'))

    })

    it('should update product', async () => {
        let repositorySpyFind = jest.spyOn(productRepositoryMock, 'find')
        let repositorySpyUpdate = jest.spyOn(productRepositoryMock, 'update')
        await service.update({ id: 'teste', name: 'teste', status: 'active', paddle_id: 'pro_teste' })
        expect(repositorySpyFind).toHaveBeenCalled()
        expect(repositorySpyUpdate).toHaveBeenCalled()
    })

})