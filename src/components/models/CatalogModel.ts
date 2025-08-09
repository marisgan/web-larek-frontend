import { IItem} from '../../types/index'
import { IEvents } from '../base/events';

export interface ICatalog {
    // items: IItem[];
    // preview: IItem | null;
    setItems(items: IItem[]): void;
    getItems(): IItem[];
    // setItemPreview(item: IItem): void;
    // getItemPreview(): IItem;
}

export class CatalogModel implements ICatalog {
    protected items: IItem[] = [];
    protected preview: IItem | null = null;

    constructor(protected events: IEvents) {}

    setItems(items: IItem[]): void {
        this.items = items;
        this.events.emit('catalog:changed');
    }

    getItems(): IItem[] {
        return this.items;
    }

    getItem(id: string): IItem {
        return this.items.filter(item => item.id === id)[0]
    }

    setItemPreview(id: string) {
        this.preview = this.items.filter(item => item.id === id)[0];
        this.events.emit('preview:changed', {previewItem: this.preview});
    }
}