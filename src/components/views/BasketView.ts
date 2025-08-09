import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IBasketView {
    basketList: HTMLElement[];
    basketTotal: number;
}

export class BasketView extends Component<IBasketView> {
    protected basketListElement: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected basketTotalElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.basketListElement = ensureElement('.basket__list', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.basketTotalElement = ensureElement('.basket__price', this.container);
    }

    set basketList(cards: HTMLElement[]) {
        this.basketListElement.replaceChildren(...cards);
    }

    set basketTotal(value: number) {
        this.setText(this.basketTotalElement, String(value) + ' синапсов');
    }
}