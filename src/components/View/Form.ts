import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement, ensureAllElements } from '../../utils/utils';

export interface IFormState {
    valid: boolean;
    errors: string;
}

export class Form<T> extends Component<T & IFormState> {
    protected events: IEvents;
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected _inputs: HTMLInputElement[];
    protected _formName: string;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container);

        this.events = events;
        this._formName = container.name;
        this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
        this._inputs = ensureAllElements<HTMLInputElement>('.form__input', this.container);

        this.container.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;

            this.events.emit(`${this._formName}.${field}:change`, {
                field,
                value
            });
        });

        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit(`${this._formName}:submit`);
        });
    }

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors(value: string) {
        this._errors.textContent = value;
    }

    render(data?: Partial<T & IFormState>): HTMLFormElement {
        return super.render(data) as HTMLFormElement;
    }
}