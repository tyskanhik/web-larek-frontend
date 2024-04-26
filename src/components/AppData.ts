import { FormErrors, IAppState, IFormAdress, IFormContact, IOrder, IProduct, payment } from "../types"
import { Model } from "./base/Model"



export type CatalogChangeEvent = {
    catalog: IProduct[]
}

export class AppState extends Model<IAppState> {
    catalog: IProduct[];
    basket: IProduct[] = [];
    order: IOrder = {
        items: [],
        total: 0,
        email: '',
        phone: '',
        payment: 'Онлайн',
        address: ''
    }
    formErrors: FormErrors = {};

    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges('items:chenges', {catalog: this.catalog})
    }

    set total(value: number) {
        this.order.total += value;
    }

    get total() {
        return this.order.total;  
    }

    removeItem(item: IProduct) {
        this.basket = this.basket.filter(element => element !== item);
        this.order.items = this.order.items.filter(element => element !== item.id);
    }

    setOrderAdress(field: keyof IFormAdress, value: payment) {
        this.order[field] = value;

        if (this.validateOrderAdress()) {
            this.events.emit('order:ready', this.order);
        }   
    }
    validateOrderAdress() {
        const errors: typeof this.formErrors = {};
        
        if (!this.order.address) {
            errors.address = 'Необходимо указать адресс';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    setOrderContact(field: keyof IFormContact, value: string) {
        this.order[field] = value;

        if (this.validateOrderContact()) {
            this.events.emit('order:ready', this.order);
        }   
    }
    validateOrderContact() {
        const errors: typeof this.formErrors = {};
        
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}