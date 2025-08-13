import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { IForm } from "../../types";



export class Form extends Component<IForm> {
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;
    protected inputs: HTMLInputElement[];
    protected altButtons: HTMLButtonElement[] | null = null;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('.submit_button', this.container);
        this.errorElement = ensureElement('.form__errors', this.container);
        this.inputs = ensureAllElements<HTMLInputElement>('.form__input', this.container);
        if (this.container.name === 'order') {
            this.altButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
            this.altButtons.forEach(
            button => button.addEventListener('click', () => this.events.emit('payment:input', {payment: button.name})));
        }

        this.container.addEventListener('submit', (evt: Event) => {
            evt.preventDefault();
            const target = evt.target as HTMLFormElement;
            this.events.emit(`${target.name}:submit`);
        });

        this.inputs.forEach(
            input => input.addEventListener('input', (evt: Event) => {
                const target = evt.target as HTMLInputElement;
                const field = target.name;
                const value = target.value;
                const data: Record<string, string> = {}
                data[field] = value
                this.events.emit(`${this.container.name}:input`, data);
            }))

    }

    set submitState(state: boolean) {
        this.setDisabled(this.submitButton, !state);
    }

    set error(value: string) {
        this.setText(this.errorElement, value);
    }

    set payment(value: string) {
        if (this.altButtons === null) return
        if (value){
            this.altButtons.forEach(button => {
                this.toggleClass(button, 'button_alt-active', button.name === value);
            })
        } else {
            this.altButtons.forEach(button => {
                this.toggleClass(button, 'button_alt-active', false);
            })
        }
    }

    set address(value: string) {
        const input = this.inputs.find((input) => input.name === 'address');
        if (input) input.value = value;
    }

    set email(value: string) {
        const input = this.inputs.find((input) => input.name === 'email');
        if (input) input.value = value;
    }

    set phone(value: string) {
        const input = this.inputs.find((input) => input.name === 'phone');
        if (input) input.value = value;
    }

    clearForm() {
        this.container.reset()
    }
}