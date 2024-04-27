import { IFormAdress, IFormContact, payment } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export interface pay {
    payment: 'Онлайн' | 'При получении'
}

export class OrderAddress extends Form<IFormAdress> implements IFormAdress{
    protected _card: HTMLElement;
    protected _cash: HTMLElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._card = container.querySelector('[name="card"]');
        this._cash = container.querySelector('[name="cash"]');

        this._card.addEventListener('click', () =>{
            const card: pay = {payment: 'Онлайн'};
            events.emit(('selection:payment'), card);
        })
        this._cash.addEventListener('click', () => {
            const cash:pay = {payment: 'При получении'}
            events.emit('selection:payment', cash);
        })
    }

    set payment(value: payment) {
        if (value === 'При получении') {
            this._cash.classList.add('button_alt-active');
            this._card.classList.remove('button_alt-active');
        } else {
            this._cash.classList.remove('button_alt-active');
            this._card.classList.add('button_alt-active');
        }
    }

    set address(value: string) {
        (this.container.querySelector('[name="address"]') as HTMLInputElement).value = value
    } 
}

export class OrderContact extends Form<IFormContact> implements IFormContact {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set email(value: string) {
        (this.container.querySelector('[name="email"]') as HTMLInputElement).value = value
    }

    set phone(value: string) {
        (this.container.querySelector('[name="phone"]') as HTMLInputElement).value = value
    }
}