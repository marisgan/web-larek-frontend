import { IItem } from '../types/index'
import { Api, ApiListResponse } from './base/api'
import { IOrder, IOrderResponse } from '../types/index';


export class WebLarekApi extends Api {

    constructor(baseUrl: string, protected cdn: string) {
        super(baseUrl);
    }

    getItems(): Promise<IItem[]> {
        return this.get('/product').then(
            (data: ApiListResponse<IItem>) =>
            data.items.map(
                item => ({...item, image: this.cdn + item.image})
            ))
    }

    postOrder(order: IOrder): Promise<IOrderResponse> {
        return this.post('/order', order).then((data: IOrderResponse) => data);
    }
}