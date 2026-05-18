import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected events: IEvents;
    protected _description: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
        this._description = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this._closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this._description.textContent = `Списано ${value} синапсов`;
    }

    render(data?: Partial<ISuccess>): HTMLElement {
        return super.render(data);
    }
}