import { IBuyer } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export class ContactsForm extends Form<Partial<IBuyer>> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._emailInput = ensureElement<HTMLInputElement>('input[name=email]', this.container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name=phone]', this.container);
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }
}