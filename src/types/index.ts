export type price = number | null;
export type category = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'
export type FormErrors = Partial<Record<keyof IOrder, string>>;


/**
 * @description Интерфейс продукта поторый приходит с сервера
*/
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: category;
    price: price;
}

/**
 * @description интерфейс карточки с продуктом
 */
export interface ICard {
    category: string;
    title: string;
    image: string;
    price: string; // price + ' синопсов'
}

/**
 * @descriptions Интерфейс превью карточки
*/
export interface ICardPreview extends ICard {
    description: string
}

/**
 * @description интерфейс корзины
*/
export interface IBasket {
    items: HTMLElement[];
    total: string; // price + ' синопсов'
}

/**
 * @description интерфейс единицы товара в корзине
 */
export interface IBasketCard {
    index: number;
    title: string;
    price: string; // price + ' синопсов'
}

/**
 * @description интерфейс формы с адрессом доставки и способом оплаты
 */
export interface IFormAdress {
    payment: 'Онлайн' | 'При получении';
    adress: string;
}

/**
 * @description интерфейс формы с контактными данными
 */
export interface IFormContact {
    email: string;
    phone: string; 
}

/**
 * @description интерфейс с заказом
 */
export interface IOrder extends IFormContact, IFormAdress {
    items: string[],
    total: number
}

/**
 * @description интерфейс формы после успешной покупки
 */
export interface IOrderSuccess {
    total: string; // price + 'синапсов' 
}

/**
 * @description Интерфейс модального окна
*/
export interface IModalData {
    content: HTMLElement;
}

/**
 * @description Интерфейс формы
*/
export interface IFormState {
    valid: boolean;
    errors: string[];
}

/**
 * @description Интерфейс события
*/
export interface IProductAPI {
    getProductList: () => Promise<IProduct[]>
}