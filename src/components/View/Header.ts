import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected events: IEvents;
    protected _basketButton: HTMLButtonElement;
    protected _basketCounter: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);

        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this._basketCounter.textContent = String(value);
    }
}