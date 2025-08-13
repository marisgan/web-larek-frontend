import { IItem} from '../../types/index'
import { IEvents } from '../base/events';
import { ICatalogModel } from '../../types/index';



export class CatalogModel implements ICatalogModel {
    protected items: Map<string, IItem> = new Map();
    protected preview: string | null = null;

    constructor(protected events: IEvents) {}

    setItems(items: IItem[]): void {
        items.forEach(item => this.items.set(item.id, item));
        this.events.emit('catalog:changed');
    }

    getItems(): IItem[] {
        return Array.from(this.items.values());
    }

    getItem(id: string): IItem {
        return this.items.get(id);
    }

    setPreview(id: string) {
        this.preview = id;
        this.events.emit('preview:changed');
    }

    getPreview(): IItem {
        return this.getItem(this.preview);
    }

    getTotal(itemsIds: string[]) {
        return itemsIds.reduce((res, id) => res + this.getItem(id).price, 0);
    }
}