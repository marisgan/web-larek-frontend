import { Component } from '../base/Component'
import { IEvents } from '../base/events'
import { ensureElement } from '../../utils/utils';

interface ICatalogView {
    cardsList: HTMLElement[];
}

export class CatalogView extends Component<ICatalogView> {

    constructor (container: HTMLElement, protected events: IEvents) {
        super(container)
    }

    set cardsList(cards: HTMLElement[]){
        this.container.replaceChildren(...cards);
    }
}