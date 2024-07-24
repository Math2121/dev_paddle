import { Status } from "../../../../config/constants";
import { Subscription } from "../model";


describe('Customer', () => {
    let subscription: Subscription;

    beforeEach(() => {
        subscription = new Subscription('ctm_teste', 'sub_teste', 'pri_teste', 'pro_teste', 'active');
    });

    it('should create a new subscription', () => {
        expect(subscription.paddle_id).toEqual('sub_teste');
        expect(subscription.customer_id).toEqual('ctm_teste');
        expect(subscription.price_id).toEqual('pri_teste');
        expect(subscription).toBeInstanceOf(Subscription);
    })

    it('should valid customer id ', () => {
        expect(() => {
            new Subscription('invalid', 'sub_teste', 'pri_teste', 'pro_teste', 'active');
        }).toThrow('ctm_id not valid');
    })

    it('should valid paddle id ', () => {
        expect(() => {
            new Subscription('ctm_teste', 'invalid', 'pri_teste', 'pro_teste', 'active');
        }).toThrow('sub_id not valid');
    })

    it('should valid price id ', () => {
        expect(() => {
            new Subscription('ctm_teste', 'sub_teste', 'invalid', 'pro_teste', 'active');
        }).toThrow('pri_id not valid');
    })

    it('should valid all id ', () => {
        expect(() => {
            new Subscription('', '', '', '', '');
        }).toThrow('Customer id, paddle id or price id not provided');
    })
});
