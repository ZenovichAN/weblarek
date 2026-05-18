import { IBuyer, TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export class OrderForm extends Form<Partial<IBuyer>> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._cardButton = ensureElement<HTMLButtonElement>('button[name=card]', this.container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name=cash]', this.container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name=address]', this.container);

        this._cardButton.addEventListener('click', () => {
            this.events.emit('order.payment:change', {
                field: 'payment',
                value: 'online'
            });
        });

        this._cashButton.addEventListener('click', () => {
            this.events.emit('order.payment:change', {
                field: 'payment',
                value: 'cash'
            });
        });
    }

    set payment(value: TPayment | null) {
        this._cardButton.classList.toggle('button_alt-active', value === 'online');
        this._cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this._addressInput.value = value;
    }
}