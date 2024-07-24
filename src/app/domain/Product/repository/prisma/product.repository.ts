import { injectable } from "inversify";
import { ProductGetResponse, ProductRepositoryInterface, ProductWithPriceData } from "../../interfaces/ProductRepositoryInterface";
import { prisma } from "../../../../../infrastructure/database/prisma/instanceOfPrisma";
import { Product } from "@prisma/client";


@injectable()
export default class ProductRepository implements ProductRepositoryInterface {
    async get(): Promise<ProductGetResponse[]> {
        return await prisma.$queryRaw`
            SELECT p.id, p.name, p.paddle_id, p.status, pr.amount, pr.currency_code, pr.custom_data, pr.name as price_name FROM product as p
            INNER JOIN price as pr
            ON p.paddle_id = pr.product_id
            ;
        `;
    }
    async getWithPrice(): Promise<any> {
        const product = await prisma.product.findMany()

        if (!product) {
            return null
        }

        const prices = await prisma.$queryRaw<any>`SELECT pr.name as price_name, 
            pr.amount as amount,
            pr.currency_code as currency_code,
            pr.custom_data,
            pr.product_id,
            pr.paddle_id
            FROM product as p 
            INNER JOIN price as pr on p.paddle_id = pr.product_id`


        return product.map(item => ({

            id: item.id,
            name: item.name,
            paddle_id: item.paddle_id,
            status: item.status,
            price: prices.map((pr:any) => {
                if (pr.product_id == item.paddle_id) {
                    return {
                        id: pr.paddle_id,
                        price_name: pr.price_name,
                        currency: pr.currency_code,
                        amount: pr.amount,
                        custom_data: JSON.parse(pr.custom_data)
                    }
                }
            }).filter((pr:any) =>pr)

        }))

    }
    async create(product: any): Promise<void> {
        await prisma.product.create({
            data: {
                id: product.id,
                name: product.name,
                status: product.status,
                paddle_id: product.paddle_id
            }

        })


    }
    async find(id: string): Promise<Product | null> {
        return prisma.product.findUnique({ where: { paddle_id: id } })
    }
    async findWithPrice(id: string): Promise<ProductWithPriceData | null> {
        const product = await prisma.product.findUnique({
            where: { id: id }
        });

        const price = await prisma.$queryRaw<any>`SELECT p.name as product_name, 
        pr.amount as amount,
        pr.currency_code as currency_code 
        FROM product as p 
        INNER JOIN price as pr on p.paddle_id = pr.product_id 
        WHERE p.id = ${product?.id} `

        if (!product || price.length === 0) {
            return null
        }
        return {
            name: product.name,
            id: product.id,
            paddle_id: product.paddle_id,
            price: price
        }

    }

    async update(product: any): Promise<void> {
        await prisma.product.update({
            where: {
                id: product.id,
            },
            data: {
                ...product
            }
        })

    }

}