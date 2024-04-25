import { IAppState, IProduct } from "../types"
import { Model } from "./base/Model"



export type CatalogChangeEvent = {
    catalog: IProduct[]
}

export class AppState extends Model<IAppState> {
    catalog: IProduct[];
    basket: IProduct[] = []

    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges('items:chenges', {catalog: this.catalog})
    }
}