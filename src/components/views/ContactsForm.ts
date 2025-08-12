import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IContactsForm {
    submitState: boolean;
    error: string;
}

export class ContactsForm extends Component<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.emailInput = ensureElement<HTMLInputElement>('.form__input-email', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('.form__input-phone', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('.submit_button', this.container);
        this.errorElement = ensureElement('.form__errors', this.container);

        this.emailInput.addEventListener('input', () => this.events.emit('contacts:input', {email: this.emailInput.value}));
        this.phoneInput.addEventListener('input', () => this.events.emit('contacts:input', {phone: this.phoneInput.value}));
        this.container.addEventListener('submit', (evt: Event) => {
            evt.preventDefault();
            this.events.emit('contacts:submit')});
    }

    set submitState(state: boolean) {
        this.setDisabled(this.submitButton, !state);
    }

    set error(value: string) {
        this.setText(this.errorElement, value);
    }

    clearForm() {
        this.container.reset()
    }
}