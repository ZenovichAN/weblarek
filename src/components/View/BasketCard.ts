import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card } from './Card';

export class BasketCard extends Card {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this._deleteButton.addEventListener('click', () => {
            this.events.emit('basket:remove', { id: this.container.dataset.id });
        });
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }

    render(data?: Partial<IProduct> & { index?: number }): HTMLElement {
        return super.render(data);
    }
}