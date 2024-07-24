import { Payment } from "../model"

describe("Payment model tests", () => {
    it("should validate payment", () => {

        const payment = new Payment( "Visa", "4242", "John Doe", "Visa")


        payment.updateCardInfo("John Doe", "Visa", "4242", "Visa")


        expect(payment.card_name).toBe("John Doe")
        expect(payment.card_brand).toBe("Visa")
        expect(payment.last4).toBe("4242")
    })

})