import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected events: IEvents;
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this._content = ensureElement<HTMLElement>('.modal__content', this.container);

        this._closeButton.addEventListener('click', () => {
            this.close();
        });

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = '';
        this.content = document.createElement('div');
        this.events.emit('modal:close');
    }

    render(data?: Partial<IModalData>): HTMLElement {
        super.render(data);
        return this.container;
    }
}