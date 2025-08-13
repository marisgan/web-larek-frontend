// DATA LAYER

export interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
  }

  export interface IBasketModel {
      addItem(id: string): void;
      removeItem(id: string): void;
      getItems(): string[];
      getCount(): number;
      contains(id: string): boolean;
      clearBasket(): void;
  }

  export interface ICatalogModel {
    setItems(items: IItem[]): void;
    getItems(): IItem[];
    getItem(id: string): IItem;
    setPreview(id: string): void;
    getPreview(id: string): IItem;
    getTotal(itemsIds: string[]): number;
}

export interface IUserInfo {
    payment: string;
    address: string;
    email: string;
    phone: string;
}


// VIEWS LAYER

export interface IBasketView {
    basketList: HTMLElement[];
    basketTotal: number;
    basketButtonState: boolean;
    basketEmpty: boolean;
}

export interface IBuyButton {
    text: string;
    status: string;
}

export interface ICard extends IItem {
    index: number;
    buyButton: IBuyButton;
}

export interface ICatalogView {
    cardsList: HTMLElement[];
}

export interface IForm extends IUserInfo {
    submitState: boolean;
    error: string;
}

export interface IHeader {
    counter: number;
}

export interface IModal {
    content: HTMLElement;
}

export interface ISuccess {
    total: number;
}


// COMMUNICATION LAYER

export interface IOrderResponse {
	id: string;
	total: number;
}

export interface IOrder extends IUserInfo {
    total: number;
	items: string[];
}






// интерфейс для класса Header
export interface IHeaderData {
    counter: number;
}

// интерфейс для класса Gallery
export interface IGalleryData {
    catalog: HTMLElement[];
}



