import "reflect-metadata"
import { SubscriptionService } from "../service";
import MockCustomerRepository from "../../Customer/tests/mock/MockCustomerRepository";

import { MockSubscriptionRepository } from "./mock/mockSubscriptionRepository";

import { MockPriceRepository } from "./mock/MockPriceRepository";
import { Subscription } from "../model";
import { MockApiSubscription } from "./mock/MockApiSubscription";

describe('Subscription', () => {
    let subscriptionService: SubscriptionService;
    let mockRepository = new MockCustomerRepository()
    let priceRepository = new MockPriceRepository()
    let apiSubscriptionMock = new MockApiSubscription();
    let mockSubscriptionRepository = new MockSubscriptionRepository()
    beforeEach(() => {
        subscriptionService = new SubscriptionService(
            mockRepository,
            priceRepository,
            apiSubscriptionMock,
            mockSubscriptionRepository);
    });

    afterEach(() => {
        mockRepository = new MockCustomerRepository()
        mockSubscriptionRepository = new MockSubscriptionRepository()
    })

    function testFunction(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            resolve();
        });
    }
    it('should change plan for customer', async () => {
        const customer_id = 'ctm_teste';
        const subscriptionServiceRes = await subscriptionService.changePlan(customer_id, 'pri_teste2');


        expect(subscriptionServiceRes).toHaveProperty('customer_id')
        expect(subscriptionServiceRes.status).toBe('active')
    })


    it('should not change plan for customer who is inactive', async () => {
        const customer_id = 'ctm_teste';

        mockRepository.findCustomerByPaddleId = jest.fn().mockReturnValue({
            customer: {
                status: 'paused'
            }
        });
        await expect(subscriptionService.changePlan(customer_id, 'pri_teste')).rejects.toThrow(
            'Customer is not active'
        );
    })

    it('should not change plan for price with different currency code', async () => {
        const customer_id = 'ctm_teste';

        await expect(subscriptionService.changePlan(customer_id, 'pri_teste3')).rejects.toThrow(
            'Currencies do not match'
        );
    })
    it('should create new subscription', async () => {
        const subscription = await subscriptionService.createSubscription({
            customer_id: 'ctm_CUSTOMER_ID',
            paddle_id: 'sub_PADDLE_ID',
            price_id: 'pri_PRICE_ID',
            product_id: 'pro_PRODUCT_ID',
            status: 'active'
        });

        expect(subscription).toHaveProperty('customer_id')
        expect(subscription?.status).toBe('active')

    })
    it('should pause the subscription', async () => {
        const customer_id = 'ctm_teste';

        expect(async () => {
            await subscriptionService.pauseRenovation(customer_id)
        }).not.toThrow()
    })
    it('should not pause the subscription when the subscription is inactive', () => {

        expect(
            async () => {
                const subscription_id = 'SUBSCRIPTION_ID';
                mockSubscriptionRepository.find = jest.fn().mockReturnValue({
                    id: "sub_teste",
                    customer_id: "ctm_teste",
                    paddle_id: "sub_teste",
                    status: 'canceled',
                    price_id: "pri_teste",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                subscriptionService = new SubscriptionService(mockRepository, priceRepository, apiSubscriptionMock, mockSubscriptionRepository);
                await subscriptionService.pauseRenovation(subscription_id)
            }
        ).rejects.toThrow("Subscription is not active")
    })
    it('should not pause the subscription not found', async () => {
        expect(async () => {
            const subscription_id = 'sub_teste';
            mockSubscriptionRepository.find = jest.fn().mockReturnValue(null)

            subscriptionService = new SubscriptionService(mockRepository, priceRepository, apiSubscriptionMock, mockSubscriptionRepository);
            await subscriptionService.pauseRenovation(subscription_id)
        }).rejects.toThrow("Could not find subscription")
    })

    it('should resume the subscription', async () => {

        const customer_id = 'ctm_teste';

        let subscriptionPaused = new Subscription(customer_id, 'sub_teste', 'pri_teste', 'pro_teste', 'paused')

        mockSubscriptionRepository.find = jest.fn().mockReturnValue(subscriptionPaused)
        expect(async () => {
            await subscriptionService.resumeRenovation(customer_id)
        }).not.toThrow()
    })


    it('should not resume the subscription when subscription is not paused', async () => {

        const customer_id = 'ctm_teste';


        expect(async () => {
            await subscriptionService.resumeRenovation(customer_id)
        }).rejects.toThrow("Subscription is not paused")
    })

    it('should not resume the subscription when subscription is null', async () => {

        const customer_id = 'ctm_teste';

        mockSubscriptionRepository.find = jest.fn().mockReturnValue(null)
        expect(async () => {
            await subscriptionService.resumeRenovation(customer_id)
        }).rejects.toThrow("Could not find subscription")
    })

    it("should check if customer is active", () => {

        const customer_id = 'ctm_teste';
        mockRepository.findCustomerByPaddleId = jest.fn().mockReturnValue(
            {
                customer_status: "active"
            }

        );
        let service = new SubscriptionService(
            mockRepository,
            priceRepository,
            apiSubscriptionMock,
            mockSubscriptionRepository
        )

        expect(async ()=> {
            await service.checkIfCustomerIsActive(customer_id)
        }).not.toThrow();
    })

    it("should check if customer is not active", async () => {


        const customer_id = 'ctm_teste';
        mockRepository.findCustomerByPaddleId = jest.fn().mockReturnValue(
            {
                customer_status: "false"
            }

        );
        let service = new SubscriptionService(
            mockRepository,
            priceRepository,
            apiSubscriptionMock,
            mockSubscriptionRepository
        )

        expect(async ()=> {
            await service.checkIfCustomerIsActive(customer_id)
        }).rejects.toThrow("Customer is not active");

    })

    it("should check if subscription is active", async () => {
        const customer_id = 'ctm_teste';
        const subscription = new Subscription(customer_id, 'sub_id', 'pri_id', 'pro_id', 'active');
        mockSubscriptionRepository.find = jest.fn().mockReturnValue(subscription);

        let service = new SubscriptionService(
            mockRepository,
            priceRepository,
            apiSubscriptionMock,
            mockSubscriptionRepository
        )

        expect(async ()=> {
            await service.checkIfSubscriptionIsActive(customer_id)
        }).not.toThrow();
    })
    it("should check if subscription is not active", async () => {
        const customer_id = 'ctm_teste';
        const subscription = new Subscription(customer_id, 'sub_id', 'pri_id', 'pro_id', 'canceled');
        mockSubscriptionRepository.find = jest.fn().mockReturnValue(subscription);

        let service = new SubscriptionService(
            mockRepository,
            priceRepository,
            apiSubscriptionMock,
            mockSubscriptionRepository
        )

        expect(async ()=> {
            await service.checkIfSubscriptionIsActive(customer_id)
        }).rejects.toThrow("Subscription is not active");
    })



});
