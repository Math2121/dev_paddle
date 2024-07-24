import { v4 as uuidv4 } from 'uuid';
import { ModelException } from '../../../utils/customExceptions';
export default class Price {

    private _id: string;
    private _name: string;
    private _amount: string;
    private _currency_code: string;
    private _status: string;
    private _paddle_id: string
    private _product_id: string;

    constructor(amount: string, currency_code: string, paddle_id: string, status: string,product_id: string, name:string) {
        this._id = uuidv4();
        this._amount = amount;
        this._status = status
        this._currency_code = currency_code;
        this._paddle_id = paddle_id
        this._product_id = product_id
        this._name = name;
        this.validate()

    }

    public validate() {


        if (+this._amount < 0) {
            throw new ModelException('Amount must be greater than 0');
        }

        if (this._currency_code.length === 0) {
            throw new ModelException('Currency code is required');
        }

        if (this._currency_code.length > 3) {
            throw new ModelException('Currency code must be less than 3 characters');
        }

        if (this._currency_code.length < 3) {
            throw new ModelException('Currency code must be greater than 3 characters');
        }
    }

    alterPrice(price: string) {
        this._amount = price;
        this.validate()
    }

    deactivate() {
        this._status = "archived"
        this.validate()
    }

    changeCurrency(currency: string) {
        this._currency_code = currency
        this.validate()
    }

    get status() {
        return this._status
    }

    get id() {
        return this._id
    }

    get amount() {
        return this._amount
    }

    get paddle_id() {
        return this._paddle_id
    }
    get currency_code() {
        return this._currency_code
    }
    get product_id() {
        return this._product_id
    }
    get name() {
        return this._name
    }
}