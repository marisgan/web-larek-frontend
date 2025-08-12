import { IEvents } from '../base/events'
import { IItem } from '../../types';

export interface IOrderInfo {
    items: string[];
    total: number;
}

export interface IBasketModel {
    addItem(item: IItem): void;
    removeItem(id: string): void;
    getItems(): IItem[];
    getCount(): number;
    getTotal(): number;
    contains(id: string): boolean;
    clearBasket(): void;
    getOrderInfo(): IOrderInfo;
}

export class BasketModel implements IBasketModel {

    protected items: Map<string, IItem> = new Map();

    constructor(protected events: IEvents) {}

    addItem(item: IItem) {
        this.items.set(item.id, item)
        this.events.emit('basket:changed');
    }

    removeItem(id: string) {
        this.items.delete(id);
        this.events.emit('basket:open');
        this.events.emit('basket:changed');
    }

    getItems(): IItem[] {
        return Array.from(this.items.values())
    }

    getCount(): number {
        return this.items.size;
    }

    getTotal(): number {
        return Array.from(
            this.items.values()
        ).reduce((res, item) => res + item.price, 0);
    }

    contains(id: string): boolean {
        return this.items.has(id);
    }

    clearBasket() {
        this.items.clear();
        this.events.emit('basket:changed')
    }

    getOrderInfo(): IOrderInfo {
        return {
            items: this.getItems().map(item => item.id),
            total: this.getTotal()
        }
    }
}