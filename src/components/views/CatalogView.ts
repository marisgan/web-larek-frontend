import { Component } from '../base/Component'
import { IEvents } from '../base/events'
import { ICatalogView } from '../../types';


export class CatalogView extends Component<ICatalogView> {

    constructor (container: HTMLElement, protected events: IEvents) {
        super(container)
    }

    set cardsList(cards: HTMLElement[]){
        this.container.replaceChildren(...cards);
    }
}