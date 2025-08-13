import { Component } from '../base/Component'
import { IEvents } from '../base/events'
import { ensureElement } from '../../utils/utils';
import { IHeader } from '../../types';



export class Header extends Component<IHeader> {
    protected container: HTMLElement;
    protected counterElement: HTMLElement;
    protected openBasket: HTMLButtonElement;

    constructor (container: HTMLElement, protected events: IEvents) {
        super(container);
        this.counterElement = ensureElement('.header__basket-counter', this.container);
        this.openBasket = ensureElement<HTMLButtonElement>('.header__basket', this.container);

        this.openBasket.addEventListener('click', () => this.events.emit('basket:open'))
    }

    set counter(value: number) {
        this.setText(this.counterElement, value)
    }
}