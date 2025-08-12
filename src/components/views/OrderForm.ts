import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { TPaymentMethod } from "../models/UserModel";

export interface IOrderForm {
    altButton: string | null;
    submitState: boolean;
    error: string;
}

export class OrderForm extends Component<IOrderForm> {
    protected altButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.altButtons = ensureAllElements('.button_alt', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('.form__input', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('.submit_button', this.container);
        this.errorElement = ensureElement('.form__errors', this.container);

        this.altButtons.forEach(
            button => button.addEventListener('click', () => this.events.emit('payment:input', {payment: button.name})));

        this.container.addEventListener('input', (evt: Event) => {
            const target = evt.target as HTMLInputElement;
            const value = target.value;
            this.events.emit('address:input', {address: value})});

        this.container.addEventListener('submit', (evt: Event) => {
            evt.preventDefault();
            this.events.emit('order:submit');
        });

    }

    set altButton(name: string | null) {
        if (name){
            this.altButtons.forEach(button => {
                this.toggleClass(button, 'button_alt-active', button.name === name);
            })
        } else {
            this.altButtons.forEach(button => {
                this.toggleClass(button, 'button_alt-active', false);
            })
        }
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
