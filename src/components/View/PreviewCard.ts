import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card } from './Card';

interface IPreviewCardData extends IProduct {
    buttonText: string;
    disabled: boolean;
}

export class PreviewCard extends Card {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._category = ensureElement<HTMLElement>('.card__category', this.container);
        this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this._description = ensureElement<HTMLElement>('.card__text', this.container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this._button.addEventListener('click', () => {
            this.events.emit('card:toggle-basket', { id: this.container.dataset.id });
        });
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set category(value: string) {
        this._category.textContent = value;
        this._category.className = `card__category ${categoryMap[value as keyof typeof categoryMap]}`;
    }

    set image(value: string) {
        this.setImage(this._image, `${CDN_URL}${value}`, this._title.textContent || '');
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set buttonText(value: string) {
        this._button.textContent = value;
    }

    set disabled(value: boolean) {
        this._button.disabled = value;
    }

    render(data?: Partial<IPreviewCardData>): HTMLElement {
        return super.render(data);
    }
}