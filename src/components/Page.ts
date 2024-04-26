import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


export interface IPage {
    catalog: HTMLElement[];
    basketCounter: number;
    locked: boolean
}

export class Page extends Component<IPage> implements IPage {
    protected _catalog: HTMLElement;
    protected _basket: HTMLElement;
    protected _basketCounter: HTMLSpanElement;
    protected _wrapper: HTMLElement;


    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container)

        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basketCounter = ensureElement<HTMLSpanElement>('.header__basket-counter');
        this._basket = ensureElement<HTMLElement>('.header__basket');


        this._basket.addEventListener('click', () => {
            this.events.emit('bids:open')
        });
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items)
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }

    set basketCounter(value: number) {
        this.setText(this._basketCounter, String(value))
    }
}