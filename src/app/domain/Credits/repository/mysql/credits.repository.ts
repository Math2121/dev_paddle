import { inject, injectable, multiInject } from "inversify";
import { CreditsRepositoryInterface } from "../interface/credits.repository.interface";
import { DatabaseConnection } from "../../../../../infrastructure/database/interface/database_connection.interface";
import { TYPES } from "../../../../../infrastructure/library/inversify/types";
import { RepositoryException } from "../../../../../utils/customExceptions";
import { Observer } from "../../../../observers/interface/IObserver";
import { CreditData } from "../../interface/credits.service.interface";
import { v4 as uuidv4 } from 'uuid';
import { generateCurrentTimestamp } from "../../../../../utils/commonUtils";
import { prisma } from "../../../../../infrastructure/database/prisma/instanceOfPrisma";
import logger from "../../../../../infrastructure/library/pino";

@injectable()
export class CreditsRepository implements CreditsRepositoryInterface {

  constructor(
    @inject(TYPES.MySqlConnection) private creditConnection: DatabaseConnection, 
    @multiInject('CreditObserver') private observers: Observer[]) {

  }

  async update(entity: any): Promise<void> {
    let connection = await this.creditConnection.connect()
    try {
      await connection.execute(`
        UPDATE credits 
        SET credits.enabled = 0 
        WHERE credits.user_id = '${entity.customer_id}' AND credits.created_at IN (
          SELECT MAX(sub_table.created_at)
          FROM (SELECT * FROM credits) AS sub_table
          WHERE sub_table.user_id = '${entity.customer_id}'
        );
        `)
    } catch (error: any) {
      throw new RepositoryException(error)
    }finally{
      await connection.release()
    }
  }

  async selectCreditsByUser(customerId: string) {
    let credits = await this.creditConnection.connect()
    try {
      let [rows, fields] = await credits.execute(`SELECT * FROM credits WHERE user_id = '${customerId}' ORDER BY created_at DESC LIMIT 1;`)

      return rows[0]
    } catch (error:any) {
      throw new RepositoryException(error)
    }finally{

      await credits.release()
    }

  }

  async create(entity: CreditData): Promise<void> {
    let connection = await this.creditConnection.connect()
    try {
      await connection.execute(`INSERT INTO credits (id, user_id, title, credit_amount, spent_amount, enabled, expiration_at, created_at)
        VALUES(
            '${uuidv4()}',
            '${entity.customer_id}', 
           '${entity.product_name}', 
            ${entity.monthly_minutes}, 
            ${entity.spent_amount ? entity.spent_amount : 0.00}, 
            1, 
            '${entity.billing_period.ends_at}', 
            '${generateCurrentTimestamp()}'); `)

      await this.notifyCreated(entity);
    } catch (error: any) {
      throw new RepositoryException(error)
    } finally {
      await connection.release();
    }
  }

  async selectCreditHistory(subscription_id: string, expiration_at: string) {
    try {
      return await prisma.historyCredit.findFirst({
        where: {
          invoiceId: subscription_id,
          expirationAt: expiration_at,
        }
      })

    } catch (error: any) {
      throw new RepositoryException(error)
    }
  }

  private async notifyCreated(value: any) {
    for (const observer of this.observers) {
      await observer.created(value);
    }
  }

}