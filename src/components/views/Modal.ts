import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.contentElement = ensureElement('.modal__content', this.container);

        this.closeButton.addEventListener('click', () => this.events.emit('modal:close'));
    }
    set content(content: HTMLElement) {
        this.contentElement.replaceChildren(content);
    }

    open(){
        this.toggleClass(this.container, 'modal_active', true);
    }

    close(){
        this.toggleClass(this.container, 'modal_active', false);
    }

    render(data: IModal) {
        super.render(data);
        this.open()
        return this.container
    }
}