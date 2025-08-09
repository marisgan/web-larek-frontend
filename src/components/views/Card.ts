import { Component } from "../base/Component";
import { IItem } from '../../types'
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";


export class Card extends Component<IItem> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected cardId: string;
    protected categoryElement: HTMLElement | null = null;
    protected imageElement: HTMLImageElement | null = null;
    protected descriptionElement: HTMLElement | null = null;
    protected buyButton: HTMLButtonElement | null = null;
    protected removeButton: HTMLButtonElement | null = null;

    constructor(container: HTMLButtonElement, protected events: IEvents) {
        super(container);
        this.titleElement = ensureElement('.card__title', this.container);
        this.priceElement = ensureElement('.card__price', this.container);
        this.categoryElement = this.container.querySelector('.card__category');
        this.imageElement = this.container.querySelector('card__image');
        this.descriptionElement = this.container.querySelector('.card__text');
        this.buyButton = this.container.querySelector('.preview__buy-button');
        this.removeButton = this.container.querySelector('.basket__item-delete')

        if (this.buyButton) {
            this.buyButton.addEventListener('click', () => this.events.emit('item:buy', {id: this.cardId}));
        } else if (this.removeButton) {
            this.removeButton.addEventListener('click', () => this.events.emit('item:remove', {id: this.cardId}));
        } else {
            this.container.addEventListener('click', () => this.events.emit('card:selected', {id: this.cardId}));
        }
    }
    set id(value: string) {
        this.cardId = value;
    }

    set title(value: string){
        this.setText(this.titleElement, value)
    }

    set price(value: string | null){
        let text = value + ' синапсов'
        if (!value) text = 'Бесценно';
        this.setText(this.priceElement, text);
    }

    set category(value: string){
        if (!this.categoryElement) return
        this.setText(this.categoryElement, value)
    }

    set image(value: string){
        if (!this.imageElement) return
        const alt = 'Изображение ' + this.titleElement.textContent
        this.setImage(this.imageElement, value, alt)
    }

    set description(value: string){
        if (!this.descriptionElement) return
        this.setText(this.descriptionElement, value)
    }

}