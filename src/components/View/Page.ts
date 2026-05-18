import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IPage {
    counter: number;
    gallery: HTMLElement[];
}

export class Page extends Component<IPage> {
    protected events: IEvents;
    protected _basketButton: HTMLButtonElement;
    protected _basketCounter: HTMLElement;
    protected _gallery: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this._gallery = ensureElement<HTMLElement>('.gallery', this.container);

        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this._basketCounter.textContent = String(value);
    }

    set gallery(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }

    render(data?: Partial<IPage>): HTMLElement {
        return super.render(data);
    }
}