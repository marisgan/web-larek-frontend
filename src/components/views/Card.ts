import { Component } from "../base/Component";
import { IItem } from '../../types'
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export interface IBuyButton {
    text: string;
    status: string;
}

interface ICard extends IItem {
    index: number;
    buyButton: IBuyButton;
}

export class Card extends Component<ICard> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected cardId: string;
    protected categoryElement: HTMLElement | null = null;
    protected imageElement: HTMLImageElement | null = null;
    protected descriptionElement: HTMLElement | null = null;
    protected buyButtonElement: HTMLButtonElement | null = null;
    protected removeButtonElement: HTMLButtonElement | null = null;
    protected indexElement: HTMLElement | null = null;

    private onBuyClick = () => this.events.emit('item:buy', {id: this.cardId});
    private onRemoveClick = () => this.events.emit('item:remove', {id: this.cardId});
    private onSelectClick = () => this.events.emit('card:selected', {id: this.cardId});

    constructor(container: HTMLButtonElement, protected events: IEvents) {
        super(container);
        this.titleElement = ensureElement('.card__title', this.container);
        this.priceElement = ensureElement('.card__price', this.container);
        this.categoryElement = this.container.querySelector('.card__category');
        this.imageElement = this.container.querySelector('.card__image');
        this.descriptionElement = this.container.querySelector('.card__text');
        this.buyButtonElement = this.container.querySelector('.preview__buy-button');
        this.removeButtonElement = this.container.querySelector('.basket__item-delete');
        this.indexElement = this.container.querySelector('.basket__item-index');

        if (!this.buyButtonElement && !this.removeButtonElement) {
            this.container.addEventListener('click', this.onSelectClick);
        }
        if (this.removeButtonElement) {
            this.removeButtonElement.addEventListener('click', this.onRemoveClick);
        }
    }

    set id(value: string) {
        this.cardId = value;
    }

    set title(value: string){
        this.setText(this.titleElement, value)
    }

    set price(value: string | null){
        const text = value ? value + ' синапсов' : 'Бесценно';
        this.setText(this.priceElement, text);
    }

    set category(value: string){
        if (!this.categoryElement) return
        this.setText(this.categoryElement, value)
    }

    set image(url: string){
        if (!this.imageElement) return
        const alt = 'Изображение ' + (this.titleElement?.textContent ?? '');
        this.setImage(this.imageElement, url, alt);
    }

    set description(value: string){
        if (!this.descriptionElement) return
        this.setText(this.descriptionElement, value)
    }

    set index(value: number) {
        if (this.indexElement) {
            this.setText(this.indexElement, value);
        }
    }

    set buyButton(settings: IBuyButton) {
        this.setText(this.buyButtonElement, settings.text);
        switch (settings.status) {
            case 'buy': {
                this.buyButtonElement.addEventListener('click', this.onBuyClick);
                this.setDisabled(this.buyButtonElement, false);
                return
            }
            case 'remove': {
                this.buyButtonElement.addEventListener('click', this.onRemoveClick);
                this.setDisabled(this.buyButtonElement, false);
                return
            }
            case 'disabled': this.setDisabled(this.buyButtonElement, true);
        }

    }
}