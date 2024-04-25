import { IAppState, IProduct } from "../types"
import { Model } from "./base/Model"



export type CatalogChangeEvent = {
    catalog: IProduct[]
}

export class AppState extends Model<IAppState> {
    catalog: IProduct[];
    basket: IProduct[] = [];
    _total: number = 0;

    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges('items:chenges', {catalog: this.catalog})
    }

    set total(value: number) {
        this._total += value;
    }

    get total() {
        return this._total;  
    }

    removeItem(item: IProduct) {
        this.basket = this.basket.filter(element => element !== item);
    }
}