import { v4 as uuidv4 } from 'uuid';
import { ModelException } from '../../../utils/customExceptions';
export class Subscription {
    private _id: string
    private _customer_id: string = ''
    private _paddle_id: string = ''
    private _status: string = ''
    private _product_id: string = ''
    private _price_id: string = ''
    constructor(
        customer_id: string,
        paddle_id: string,
        price_id: string,
        product_id: string,
        status: string
    ) {
        this._id = uuidv4();
        this._status = status;
        this._paddle_id = paddle_id;
        this._price_id = price_id;
        this._product_id = product_id;
        this._customer_id = customer_id
        this.validate()
    }


    public validate() {
        if (this._customer_id === '' || this._paddle_id === '' || this._price_id === '') {
            throw new ModelException('Customer id, paddle id or price id not provided');
        }

        const validIdPrefixes = ["ctm_", "pri_", "sub_"];
        const invalidId = validIdPrefixes.find(
            prefix => !(this.paddle_id.startsWith(prefix) || this.price_id.startsWith(prefix) || this.customer_id.startsWith(prefix))
        );

        if (invalidId) {
            throw new ModelException(`${invalidId}id not valid`);
        }
    }

    changeStatus(status: string) {
        this._status = status
    }

    get id(): string {
        return this._id
    }

    get customer_id(): string {
        return this._customer_id
    }

    get paddle_id(): string {
        return this._paddle_id
    }

    get price_id(): string {
        return this._price_id
    }

    get status(): string {
        return this._status
    }

    get product_id(): string {
        return this._product_id
    }



}