import { IBasket, IItem} from '../../types'
import { IEvents } from '../base/events'

// export interface IBasket {
//     items: IItem[];
//     addItem(item: IItem): void;
//     removeItem(id: TItemId): void;
//     getItems(): IItem[];
//     getCount(): number;
//     getTotal(): number;
//     contains(id: TItemId): boolean;
// }

export class BasketModel {
    protected items: Map<string, IItem> = new Map()

    constructor(protected events: IEvents) {}

    addItem(item: IItem) {
        this.items.set(item.id, item);
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
        return Array.from(this.items.values()).reduce((res, item) => res + item.price, 0);
    }

    contains(id: string): Boolean {
        return this.items.has(id);
    }
}