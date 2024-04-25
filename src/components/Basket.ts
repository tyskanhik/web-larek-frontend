import { IBasket } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";


export class Basket extends Component<IBasket> implements IBasket {
    protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

    constructor(content: HTMLElement, protected events: EventEmitter) {
        super(content);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

        this._button.addEventListener('click', () => {
            events.emit('order:open');
        })
    }

    set items(items: HTMLElement[]) {
        if(items.length >= 0) {
            this._list.replaceChildren(...items)
        }
    }

    set total(value: number) {
        this.setText(this._total, value)
    }
}