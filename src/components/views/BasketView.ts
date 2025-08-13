import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { IBasketView } from "../../types";


export class BasketView extends Component<IBasketView> {
    protected basketListElement: HTMLElement;
    protected basketButtonElement: HTMLButtonElement;
    protected basketTotalElement: HTMLElement;
    private emptyElement = createElement('span', {textContent: 'Корзина пуста'});

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.basketListElement = ensureElement('.basket__list', this.container);
        this.basketTotalElement = ensureElement('.basket__price', this.container);
        this.basketButtonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.basketButtonElement.addEventListener('click', () => this.events.emit('order:start'));
    }

    set basketList(cards: HTMLElement[]) {
        this.basketListElement.replaceChildren(...cards);
    }

    set basketTotal(value: number) {
        this.setText(this.basketTotalElement, String(value) + ' синапсов');
    }

    set basketButtonState(state: boolean) {
        this.setDisabled(this.basketButtonElement, !state);
    }

    set basketEmpty(state: boolean) {
        if (state) {
            this.basketListElement.replaceChildren(this.emptyElement);
        }
    }
}