import Product from "../model"

describe('Product', () => {

    it('should create product', () => {

        const product = new Product('product 1', 'active', 'pri_teste')

        expect(product.name).toEqual('product 1')
        expect(product.status).toEqual('active')
        expect(product.paddle_id).toEqual('pri_teste')
    })



    it('should not create product without name', () => {
        expect(() => new Product('', 'active', 'pri_teste')).toThrow('Product name is required')
    })

    it('should not create product without status', () => {
        expect(() => new Product('product 1', '', 'pri_teste')).toThrow('Product status is required')
    })

    it('should not create product without paddle_id', () => {
        expect(() => new Product('product 1', 'active', '')).toThrow('Product paddle_id is required')
    })

})