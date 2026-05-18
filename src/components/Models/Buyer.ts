import { IBuyer, TBuyerErrors, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
    protected _payment: TPayment | null;
    protected _email: string;
    protected _phone: string;
    protected _address: string;
    protected events: IEvents;

    constructor(events: IEvents) {
        this._payment = null;
        this._email = '';
        this._phone = '';
        this._address = '';
        this.events = events;
    }

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) {
            this._payment = data.payment;
        }

        if (data.email !== undefined) {
            this._email = data.email;
        }

        if (data.phone !== undefined) {
            this._phone = data.phone;
        }

        if (data.address !== undefined) {
            this._address = data.address;
        }

        this.events.emit('buyer:changed', { buyer: this.getData() });
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address
        };
    }

    clear(): void {
        this._payment = null;
        this._email = '';
        this._phone = '';
        this._address = '';
        this.events.emit('buyer:changed', { buyer: this.getData() });
    }

    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (!this._payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this._email) {
            errors.email = 'Укажите email';
        }

        if (!this._phone) {
            errors.phone = 'Укажите телефон';
        }

        if (!this._address) {
            errors.address = 'Укажите адрес';
        }

        return errors;
    }
}