import { Status } from "../../../../config/constants";
import { Customer } from "../model";

describe('Customer', () => {
    let customer: Customer;

    beforeEach(() => {
        customer = Customer.createCustomer('John Doe', 'john@example.com', Status.ACTIVE);
    });

    it('should create a new customer', () => {
        expect(customer.name).toEqual('John Doe');
        expect(customer.email).toEqual('john@example.com');
        expect(customer.status).toEqual(Status.ACTIVE);
        expect(customer).toBeInstanceOf(Customer);
    })

    it('should change customer status', () => {
        customer.changeStatus(Status.INACTIVE);
        expect(customer.status).toEqual(Status.INACTIVE);
    })

    it('should not be able to create customer when email is invalid', () => {
        expect(() => {
            Customer.createCustomer('John Doe', 'invalid', Status.ACTIVE);
        }).toThrow('Invalid email address');
    })
});
