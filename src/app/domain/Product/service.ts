import { inject, injectable } from "inversify";
import { throwServiceException } from "../../../utils/commonUtils";
import { ProductCreateData, ProductServiceInterface } from "./interfaces/ProductServiceInterface";
import Product from "./model";
import { TYPES } from "../../../infrastructure/library/inversify/types";
import { ProductRepositoryInterface, ProductWithPriceData } from "./interfaces/ProductRepositoryInterface";
import { ServiceException } from "../../../utils/customExceptions";
import { ApiProductGatewayInterface } from "./gateway/interface/api.product.gateway.interface";

@injectable()
export default class ProductService implements ProductServiceInterface {
    public constructor(
        @inject(TYPES.ApiProductGatewayInterface) private apiProductGateway: ApiProductGatewayInterface,
        @inject(TYPES.ProductRepositoryInterface) private productRepository: ProductRepositoryInterface) { }

    async find(id: string): Promise<ProductWithPriceData> {
        try {
            let productExist = await this.productRepository.findWithPrice(id)
            if (!productExist) {
                throw new ServiceException("Error finding Product")
            }
            return productExist
        } catch (error: any) {
            throwServiceException(error)
        }
    }
    async create(product: ProductCreateData): Promise<Product> {
        try {

            const newProduct = new Product(product.name, product.status, product.paddle_id)

            await this.productRepository.create(newProduct)

            return newProduct

        } catch (error: any) {
            throwServiceException(error)
        }
    }

    async update(product: any): Promise<void> {

        try {
            let productExist = await this.productRepository.find(product.paddle_id)
            if (!productExist) {
                throw new ServiceException("Error finding Product")
            }

            await this.productRepository.update({
                id: productExist.id,
                name: product.name,
                status: product.status
            })

        } catch (error: any) {
            throwServiceException(error)
        }
    }
    async getAll(): Promise<any[]> {
        try {

            const products = await this.productRepository.getWithPrice()

            if (products.length > 0) {

                let productsRes = products.map((product:any) => {
                    return {
                        id: product.id,
                        name: product.name,
                        paddle_id: product.paddle_id,
                        status: product.status,
                        price: product.price
                    }
                })

                return productsRes
            }

            throw new ServiceException("No products found")

        } catch (error: any) {
            throwServiceException(error)
        }
    }

}