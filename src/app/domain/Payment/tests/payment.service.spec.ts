import { PaymentService } from "../service"

const repositoryMock = () => {
    return {
        create: jest.fn(),
        update: jest.fn(),
        find: jest.fn().mockResolvedValue(true),
    }
} 
describe("Payment service test", () => {
    let service: PaymentService
    let mock = repositoryMock()
    beforeEach(() => {

        service = new PaymentService(mock)
    })

    it('should create payment', async () => {
        const newPayment = await service.createPayment({
            type: "card",
            last4: "4242",
            card_name: "John Doe",
            card_brand: "Visa",
            customer_id: "123",
            subscription_id: "456",
            paddle_id: "pay_teste"
        })
        expect(newPayment.type).toBe("card")
    })
    it('should update payment', async () => {
        await service.updatePayment({
            type: "card",
            last4: "4242",
            card_name: "John Doe",
            card_brand: "Visa",
            customer_id: "123",
            subscription_id: "456",
            paddle_id: "pay_teste"
        })
        expect(mock.update).toHaveBeenCalled()

    })

    it('should throw error when payment not found', async () => {
        mock.find.mockResolvedValue(null)
        await expect(async () => {
            await service.updatePayment({
                type: "card",
                last4: "4242",
                card_name: "John Doe",
                card_brand: "Visa",
                customer_id: "123",
                subscription_id: "456",
                paddle_id: "pay_teste"
            })
        }).rejects.toThrow("Payment not found")
    })
})