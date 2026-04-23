import { IApi, IOrderRequest, IOrderResponse, IProductListResponse } from '../../types';

export class WebLarekApi {
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProductList(): Promise<IProductListResponse> {
        return this.api.get<IProductListResponse>('/product/');
    }

    createOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order', order);
    }
}