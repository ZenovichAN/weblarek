import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card } from './Card';

export class CatalogCard extends Card {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._category = ensureElement<HTMLElement>('.card__category', this.container);
        this._image = ensureElement<HTMLImageElement>('.card__image', this.container);

        this.container.addEventListener('click', () => {
            this.events.emit('card:select', { id: this.container.dataset.id });
        });
    }

    set category(value: string) {
        this._category.textContent = value;
        this._category.className = `card__category ${categoryMap[value as keyof typeof categoryMap]}`;
    }

    set image(value: string) {
        this.setImage(this._image, `${CDN_URL}${value}`, this._title.textContent || '');
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    render(data?: Partial<IProduct>): HTMLElement {
        return super.render(data);
    }
}