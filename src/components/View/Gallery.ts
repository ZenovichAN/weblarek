import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IGallery {
    items: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected _gallery: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._gallery = ensureElement<HTMLElement>('.gallery', this.container);
    }

    set items(value: HTMLElement[]) {
        this._gallery.replaceChildren(...value);
    }
}