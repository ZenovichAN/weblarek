import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { createElement, ensureElement } from '../../utils/utils';

interface IBasketView {
    items: HTMLElement[];
    total: number;
    disabled: boolean;
}

export class BasketView extends Component<IBasketView> {
    protected events: IEvents;
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this._button.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    set items(value: HTMLElement[]) {
        if (value.length) {
            this._list.replaceChildren(...value);
        } else {
            this._list.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'Корзина пуста'
                })
            );
        }
    }

    set total(value: number) {
        this._total.textContent = `${value} синапсов`;
    }

    set disabled(value: boolean) {
        this._button.disabled = value;
    }
}