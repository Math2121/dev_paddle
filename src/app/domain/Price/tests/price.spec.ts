import Price from "../model"

describe("Price model", () => {
    let price: Price
    beforeEach(() => {
        price = new Price("100", "USD", "pri_teste", 'active','product_id', "Free")
    })

    it("should validate price", () => {
        expect(price).toBeInstanceOf(Price)
    })

    it("should validate amount", () => {
        expect(price.amount).toEqual("100")
    })

    it("should validate currency code", () => {
        expect(price.currency_code).toEqual("USD")
    })


    it("should not validate currency code", () => {
        expect(() => new Price("100", "INVALID", "pri_teste", 'active','product_id', "Free")).toThrow("Currency code must be less than 3 characters");
    })


    it("should not validate amount", () => {
        expect(() => new Price("-100", "USD", "pri_teste", 'active','product_id', "Free")).toThrow("Amount must be greater than 0");
    })

    it("should not validate currency code if not passed", () => {
        expect(() => new Price("100", "", "pri_teste", 'active','product_id', "Free")).toThrow("Currency code is required");
    })

    it("should change price amount", () => {
        price.alterPrice("200")
        expect(price.amount).toEqual("200")
    })

    it("should deactivate price", () => {
        price.deactivate()
        expect(price.status).toEqual("archived")
    })

    it("should change currency code", () => { 
        price.changeCurrency("BRL")
        expect(price.currency_code).toEqual("BRL")
    })

    it("should get price name", () => {
        expect(price.name).toEqual("Free")
    })

    it("should get price product id", () => {
        expect(price.product_id).toEqual("product_id")
    })
    it("should get price paddle id", () => {
        expect(price.paddle_id).toEqual("pri_teste")
    })
    it("should get price status", () => {
        expect(price.status).toEqual("active")
    })
    

})