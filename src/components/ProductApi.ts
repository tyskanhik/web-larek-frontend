import { IOrder, IProduct, IProductAPI } from "../types";
import { Api, ApiListResponse } from "./base/api";


export interface IOrderApi {
    id: string,
    total: number
}

export class ProductApi extends Api implements IProductAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductList(): Promise<IProduct[]> {
        return this.get('/product')
            .then((data: ApiListResponse<IProduct>) =>
                data.items.map(item => ({
                    ...item,
                    image: this.cdn + item.image
                }))
            )
    }

    sendOrder(value: IOrder): Promise<IOrderApi> {
        return this.post('/order', value).then(
            (data: IOrderApi) => data
        );
    }
}