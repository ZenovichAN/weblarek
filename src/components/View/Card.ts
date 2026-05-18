import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Card extends Component<IProduct> {
    protected events: IEvents;
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
        this._title = ensureElement<HTMLElement>('.card__title', this.container);
        this._price = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }
}