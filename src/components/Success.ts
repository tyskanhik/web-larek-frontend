import { ICardActions } from "./Card";
import { Component } from "./base/Component";


export interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> implements ISuccess {
    protected _total: HTMLElement;
    protected _close: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._close = container.querySelector('.order-success__close');
        this._total = container.querySelector('.order-success__description')

        this._close.addEventListener('click', actions.onClick)
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`)
    }
}