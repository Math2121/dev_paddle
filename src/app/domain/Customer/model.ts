import { Status } from "../../../config/constants";
import { validateEmail } from "../../../utils/validation";
import { v4 as uuidv4 } from 'uuid';
export class Customer {

    private _id!: string
    private _name: string = ''
    private _email: string = ''
    private _status: Status = Status.ACTIVE
    constructor(
        name: string,
        email: string,
        status: Status
    ) {
        this._id = uuidv4();
        this._name = name;
        this._email = email;
        this._status = status
    }

    static createCustomer(name: string, email: string, status: Status): Customer {

        const isValidEmail = validateEmail(email);


        if (!isValidEmail) {
            throw new Error('Invalid email address');
        }


        return new Customer(name, email, status)
    }

    changeStatus(status: Status) {
        this._status = status
    }

    get status(): string {
        return this._status
    }

    get name(): string {
        return this._name
    }
    get email(): string {
        return this._email
    }
    get id(): string {
        return this._id
    }

}

