// Data Layer

export interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
  }

export interface ICatalog {
    items: IItem[];
    preview: IItem;
    setItems(items: IItem[]): void;
    getItems(): IItem[];
    setItemPreview(item: IItem): void;
    getItemPreview(): IItem;
}

export interface ICart {
    items: IItem[];
    addItem(item: IItem): void;
    deleteItem(id: TItemId): void;
    getItems(): IItem[];
    getCount(): number;
    getTotal(): number;
    isInCart(id: TItemId): boolean;
    getOrder(): IOrder;
}

export interface ICustomer {
    payment: 'card' | 'cash' | '';
    email: string;
    phone: string;
    address: string;
    validateInfo(data: Record<keyof TCustomerInfo, string>): boolean;
    setInfo(data: Record<keyof TCustomerInfo, string>): void;
    getInfo(): Record<keyof TCustomerInfo, string>;
}


export type TCustomerInfo = Pick<ICustomer, 'payment' | 'email' | 'phone' | 'address'>;

export type TItemId = Pick<IItem, 'id'>;

export interface IOrder extends TCustomerInfo {
    total: number;
    items: TItemId[]
}


// Views Layer

export interface IComponent<T> {
    container: HTMLElement;
    render(data?: Partial<T>): HTMLElement;
    setImage(element: HTMLImageElement, src: string, alt?: string):void;
}

// интерфейс для класса Header
export interface IHeaderData {
    counter: number;
}

// интерфейс для класса Gallery
export interface IGalleryData {
    catalog: HTMLElement[];
}

// Карточка товара в корзине
export type TCardCart = Pick<IItem, 'title' | 'price'>

// Карточка товара в каталоге
export type TCardCatalog = Pick<IItem, 'category' | 'title' | 'image' | 'price'>;

// Карточка товара в модальном окне
export type TCardModal = Pick<IItem, 'category' | 'title' | 'description' | 'price'>;
