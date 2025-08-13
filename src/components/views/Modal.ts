import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { IModal } from "../../types";


export class Modal extends Component<IModal> {
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    private onCloseClick = () => this.events.emit('modal:close');
    private onOverlayClick = (evt: MouseEvent) => {
        const target = evt.target as Node;
        if (target === this.container || !this.contentElement.contains(target)) {
            this.events.emit('modal:close');
        }
    };
    private onEsc = (evt: KeyboardEvent) => {
        if (evt.key === 'Escape') this.events.emit('modal:close');
    };

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.contentElement = ensureElement('.modal__content', this.container);
        this.contentElement.addEventListener('click', (evt) => evt.stopPropagation());
    }
    set content(content: HTMLElement) {
        this.contentElement.replaceChildren(content);
    }

    open(){
        this.toggleClass(this.container, 'modal_active', true);
        this.closeButton.addEventListener('click', this.onCloseClick);
        this.container.addEventListener('click', this.onOverlayClick);
        document.addEventListener('keydown', this.onEsc);
        document.body.style.overflow = 'hidden';
    }

    close(){
        this.toggleClass(this.container, 'modal_active', false);
        this.closeButton.removeEventListener('click', () => this.events.emit('modal:close'));
        this.contentElement.replaceChildren();
        this.closeButton.removeEventListener('click', this.onCloseClick);
        this.container.removeEventListener('click', this.onOverlayClick);
        document.removeEventListener('keydown', this.onEsc);
        document.body.style.overflow = '';

    }

    render(data: IModal) {
        super.render(data);
        this.open();
        return this.container;
    }
}