import "reflect-metadata"
import { Customer, Subscription } from "@prisma/client";
import { CustomerRepositoryInterface } from "../../Customer/interfaces/CustomerRepositoryInterface";
import { CreditsRepositoryInterface } from "../repository/interface/credits.repository.interface";
import { CreditsService } from "../service";
import { SubscriptionRepositoryInterface } from "../../Subscription/interfaces/SubscriptionRepositoryInterface";
import CreditsRepositoryMock from "./mock/CreditsRepositoryMock";
import MockCustomerRepository from "../../Customer/tests/mock/MockCustomerRepository";
import { MockSubscriptionRepository } from "../../Subscription/tests/mock/mockSubscriptionRepository";
import { CreditData, CreditUpdateData, CreditsServiceInterface } from "../interface/credits.service.interface";

describe("Credits Tests", () => {
    let creditsRepositoryMock: CreditsRepositoryInterface = new CreditsRepositoryMock();
    let customerRepositoryMock: CustomerRepositoryInterface<Customer> = new MockCustomerRepository();
    let subscriptionRepositoryMock: SubscriptionRepositoryInterface<Subscription> = new MockSubscriptionRepository();

    let creditsService:CreditsServiceInterface; 
    const valuesCredits: CreditData = {
        customer_id: "ctm_teste",
        transaction_id: "trans_teste",
        billing_period: {
            ends_at: "2022-01-31T23:59:59Z",
        },
        monthly_minutes: 1000,
        subscription_id: "sub_teste",
        product_name: "Teste"

    }
    const valuesCreditUpdate: CreditUpdateData = {
        customer_id: "ctm_teste",
        monthly_minutes: 1200,
        ends_at: "2022-02-31T23:59:59Z",
        subscription_id: "sub_teste",
        name: "Teste"
    }
    beforeEach(()=>{
        creditsService = new CreditsService(creditsRepositoryMock, customerRepositoryMock, subscriptionRepositoryMock)
    })
    afterEach(() => {
        jest.clearAllMocks();
        customerRepositoryMock = new MockCustomerRepository();
    })
    it("should register a credit", async () => {
        expect(async () => {
            await creditsService.registerCredit(valuesCredits)
        }).not.toThrow()
    })
    it("should not register a credit with susbcription existed", async () => {
        valuesCredits.subscription_id = "sub_teste"
        valuesCredits.billing_period.ends_at = '2024-02-02'
        expect(async () => {
            await creditsService.registerCredit(valuesCredits)
        }).rejects.toThrow("Credit for this subscription already exists")
    })
    it("should not register a credit with customer not found", async () => {
        valuesCredits.customer_id = ""
        expect(async () => {
            await creditsService.registerCredit(valuesCredits)
        }).rejects.toThrow("Customer not found")
    })
    it("should not register a credit with customer with not email founded", () => {
        valuesCredits.customer_id = "ctm_teste"
        customerRepositoryMock.findCustomerByEmail = jest.fn().mockResolvedValueOnce(null)

        expect(async () => {
            await creditsService.registerCredit(valuesCredits)
        }).rejects.toThrow("Customer not found")

    })
    it("should update a credit", () => {
        expect(async () => {
            await creditsService.updateCredit(valuesCreditUpdate)
        }).not.toThrow()
    })
    it("should not update a credit with customer not found", async () => {
        valuesCreditUpdate.customer_id = ""
        expect(async () => {
            await creditsService.updateCredit(valuesCreditUpdate)
        }).rejects.toThrow("Customer not found")
    })


});