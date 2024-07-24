import { Customer as CustomerPrisma } from "@prisma/client";

import { CustomerData, CustomerRepositoryInterface } from "../../interfaces/CustomerRepositoryInterface";
import { inject, injectable, multiInject } from "inversify";
import { Customer } from "../../model";
import { prisma } from "../../../../../infrastructure/database/prisma/instanceOfPrisma";
import { Observer } from "../../../../observers/interface/IObserver";
import { DatabaseConnection } from "../../../../../infrastructure/database/interface/database_connection.interface";
import { TYPES } from "../../../../../infrastructure/library/inversify/types";
import { CustomerRequestDTO } from "../../interfaces/CustomerServiceInterface";
import { RepositoryException } from "../../../../../utils/customExceptions";

@injectable()
export class CustomerRepository implements CustomerRepositoryInterface<CustomerPrisma> {
    private observers: Observer[];
    constructor(@multiInject('Observer') observers: Observer[], @inject(TYPES.MySqlConnection) private mySqlConnection: DatabaseConnection) {
        this.observers = observers;
    }
    async getUserIdByEmail(email: string): Promise<string> {
        let connection = await this.mySqlConnection.connect()
        try {
            let [rows, fields] = await connection.execute(`select id from usuarios_view where email = '${email}'`)
            return rows[0].id
        } catch (error: any) {
            throw new RepositoryException(error)
        } finally {
            await connection.release()
        }

    }
    async getEmailByToken(token: string): Promise<string | null> {
        let connection = await this.mySqlConnection.connect()
        try {
            let [rows, fields] = await connection.execute(`select * from usuarios_view where api_token = '${token}'`)
            if (!rows[0]) return null
            return rows[0].email
        } catch (error: any) {
            throw new RepositoryException(error)
        } finally {
            await connection.release()
        }
    }

    async updateStatus(customer: Customer): Promise<void> {
        await prisma.customer.update({
            where: {
                id: customer.id
            },
            data: {
                status: customer.status
            }
        })

    }

    async findCustomerByEmail(email: string): Promise<CustomerData | null> {
        let customer = await prisma.$queryRaw<CustomerData[]>`SELECT 
        c.paddle_id as customer_id,
        c.name as customer_name,
        c.email as customer_email,
        c.status as customer_status,
        s.paddle_id as subscription_id,
        p.paddle_id as price_id,
        p.amount as amount,
        p.currency_code as currency,
        pr.paddle_id as product_id,
        pr.name as product_name,
        pr.status as product_status,
        py.type,
        py.card_name,
        py.card_brand,
        py.last4
        FROM customer as c 
        left join subscription as s on s.customer_id = c.paddle_id
        left join price as p on s.price_id = p.paddle_id
        left join product as pr on pr.paddle_id = s.product_id
        left join payment as py on py.customer_id = c.paddle_id
        where c.email = ${email}`

        return customer.length > 0 ? customer[0] : null;
    }

    async findCustomerByPaddleId(id: string): Promise<CustomerData | null> {
        let customer = await prisma.$queryRaw<CustomerData[]>`SELECT 
        c.paddle_id as customer_id,
        c.name as customer_name,
        c.email as customer_email,
        c.status as customer_status,
        s.paddle_id as subscription_id,
        p.paddle_id as price_id,
        p.amount as amount,
        p.currency_code as currency,
        pr.paddle_id as product_id,
        pr.name as product_name,
        pr.status as product_status
        FROM customer as c 
        left join subscription as s on s.customer_id = c.paddle_id
        left join price as p on s.price_id = p.paddle_id
        left join product as pr on pr.paddle_id = s.product_id
        where c.paddle_id = ${id} OR c.id = ${id}`

        return customer.length > 0 ? customer[0] : null;
    }
    async create(newCustomer: CustomerRequestDTO): Promise<CustomerPrisma> {
        await this.notifyCreated(`Customer created successfully ID: ${newCustomer.paddle_id} `,);
        return await prisma.customer.create({
            data: newCustomer
        })
    }
    private async notifyCreated(value: string) {
        for (const observer of this.observers) {
            await observer.created(value);
        }
    }
}