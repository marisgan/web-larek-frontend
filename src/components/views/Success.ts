import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IComponent {
    total: number;
}

export class Success extends Component<IComponent> {
    protected totalElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);
        this.totalElement = ensureElement('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.closeButton.addEventListener('click', () => this.events.emit('success:close'));
    }

    set total(value: number) {
        this.setText(this.totalElement, `Списано ${String(value)} синапсов`);
    }
}