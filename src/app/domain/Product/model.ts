import { ModelException } from "../../../utils/customExceptions";
import { v4 as uuidv4 } from 'uuid'
export default class Product {
    private _id: string;
    private _name: string;
    private _status: string;
    private _paddle_id: string;
    constructor( name: string, status: string, paddle_id: string) {
        this._id = uuidv4();
        this._name = name;
        this._status = status;
        this._paddle_id = paddle_id
        this.validate();
    }

    validate(): void {

        if (this._name.length === 0) {
            throw new ModelException('Product name is required');
        }

        if (this._status.length === 0) {
            throw new ModelException('Product status is required');
        }

        if (this._paddle_id.length === 0) {
            throw new ModelException('Product paddle_id is required');
        }
    }

    get id(): string {
        return this._id
    }

    get name(): string {
        return this._name
    }

    get status(): string {
        return this._status
    }

    get paddle_id(): string {
        return this._paddle_id
    }

    alterName(name: string) {
        this._name = name
    }

    changeStatus(status: string) {
        this._status = status
    }


}