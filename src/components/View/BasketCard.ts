import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card } from './Card';

interface IBasketCardData extends IProduct {
    index: number;
}

export class BasketCard extends Card {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;
    protected onDelete: () => void;

    constructor(container: HTMLElement, events: IEvents, onDelete: () => void) {
        super(container, events);

        this.onDelete = onDelete;
        this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this._deleteButton.addEventListener('click', () => {
            this.onDelete();
        });
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }

    render(data?: Partial<IBasketCardData>): HTMLElement {
        return super.render(data);
    }
}