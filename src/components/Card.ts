import { ICard, ICardPreview } from "../types";
import { Component } from "./base/Component";

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card<T> extends Component<ICard> implements ICard {
    protected _category: HTMLSpanElement;
    protected _image: HTMLImageElement;
    protected _title: HTMLTitleElement;
    protected _price: HTMLSpanElement;
    private mapCategory: Map<string, string>;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._category = container.querySelector('.card__category');
        this._image = container.querySelector('.card__image');
        this._title = container.querySelector('.card__title');
        this._price = container.querySelector('.card__price');

        this.mapCategory = new Map([
            ["софт-скил", 'soft'],
            ["другое", 'other'],
            ["дополнительное", 'additional'],
            ["кнопка", 'button'],
            ["хард-скил", 'hard']
        ])

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick)
        }
    }

    set title(value: string) {
        this._title.textContent = value
    }

    set category(value: string) {
        this._category.textContent = value;
        this._category.className = `card__category card__category_${this.mapCategory.get(value)}`
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set price(value: number) {
        value === null ?
            this._price.textContent = 'Бесценно' :
            this._price.textContent = value + ' синапсов'
    }
}