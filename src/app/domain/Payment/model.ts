import { v4 as uuidv4 } from 'uuid';
export class Payment {
    private _id: string;
    private _type: string;
    private _last4: string | null;
    private _card_name: string | null;
    private _card_brand: string | null;

    constructor( type: string, last4: string | null, card_name: string | null, card_brand: string | null) {
        this._id = uuidv4();
        this._type = type;
        this._last4 = last4;
        this._card_name = card_name;
        this._card_brand = card_brand;
    }
    get id() {
        return this._id;
    }
    get type() {
        return this._type;
    }
    get last4() {
        return this._last4;
    }
    get card_name() {
        return this._card_name;
    }
    get card_brand() {
        return this._card_brand;
    }
    set card_name(card_name: string | null) {
        this._card_name = card_name;
    }
    set card_brand(card_brand: string | null) {
        this._card_brand = card_brand;
    }
    set type(type: string) {
        this._type = type;
    }
    updateCardInfo(card_name: string | null, card_brand: string | null, last4: string | null, type: string) {
        this._card_name = card_name;
        this._card_brand = card_brand;
        this.type = type
        this._last4 = last4;
    }

}