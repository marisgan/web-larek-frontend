import { IEvents } from '../base/events'
import { IBasketModel } from '../../types';


export class BasketModel implements IBasketModel {

    protected items: Set<string> = new Set();

    constructor(protected events: IEvents) {}

    addItem(id: string) {
        this.items.add(id)
        this.events.emit('basket:changed');
    }

    removeItem(id: string) {
        this.items.delete(id);
        this.events.emit('basket:open');
        this.events.emit('basket:changed');
    }

    getItems(): string[] {
        return Array.from(this.items)
    }

    getCount(): number {
        return this.items.size;
    }

    contains(id: string): boolean {
        return this.items.has(id);
    }

    clearBasket() {
        this.items.clear();
        this.events.emit('basket:changed')
    }
}