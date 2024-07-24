import { CreditData, CreditsRepositoryInterface } from "../../repository/interface/credits.repository.interface";

export default class CreditsRepositoryMock implements CreditsRepositoryInterface {
    public data = {
        userId: "ctm_teste",
        invoiceId: "sub_teste",
        creditAmount: "255",
        renewAt: "2024-02-02",
        expirationAt: "2024-02-02"
    }

    async create(entity: CreditData): Promise<void> {
        return
    }
    async update(entity: any): Promise<void> {
        return
    }
    async selectCreditsByUser(customerId: string): Promise<any> {
        return {
            ...this.data,
            spent_amount: 255
        }

    }
    async selectCreditHistory(subscription_id: string, expiration_at: string): Promise<any> {

        if (subscription_id == this.data.invoiceId && expiration_at == this.data.expirationAt) {
            return this.data
        }
        return null;
    }

}