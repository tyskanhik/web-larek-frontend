import { IBasket, IBasketCard } from "../types";
import { ensureElement } from "../utils/utils";
import { Card, ICardActions } from "./Card";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";


export class Basket<T> extends Component<T> implements IBasket {
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

    set total(value: string) {
        this.setText(this._total, value)
    }
}

export class BasketItem extends Card<IBasketCard> implements IBasketCard {
    protected _index: HTMLSpanElement;
    protected _deleteBtn: HTMLButtonElement;

    constructor(container: HTMLElement,  actions?: ICardActions) {
        super(container)

        this._index = container.querySelector('.basket__item-index');
        this._deleteBtn = container.querySelector('.basket__item-delete');

        this._deleteBtn.addEventListener('click', actions.onClick)
    }

    set index(value: number) {
        this.setText(this._index, value)
    }
}