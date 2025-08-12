import { IItem} from '../../types/index'
import { IEvents } from '../base/events';

interface ICatalogModel {
    setItems(items: IItem[]): void;
    getItems(): IItem[];
    getItem(id: string): IItem;
    setPreview(id: string): void;
    getPreview(id: string): IItem;
}

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

    getPreview() {
        return this.getItem(this.preview);
    }
}