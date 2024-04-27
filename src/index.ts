import './scss/styles.scss';
import { AppState } from './components/AppData';
import { Card, CardPreview } from './components/Card';
import { Page } from './components/Page';
import { ProductApi } from './components/ProductApi';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { ICard, IFormAdress, IFormContact, IProduct, payment } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Basket, BasketItem } from './components/Basket';
import { OrderAddress, OrderContact, pay } from './components/Order';
import { Success } from './components/Success';

/**
 * @description Темплейты
 */
const DOM = {
    templateGaleryItem: ensureElement<HTMLTemplateElement>('#card-catalog'),
    templatePreviewCard: ensureElement<HTMLTemplateElement>('#card-preview'),
    temlateBasket: ensureElement<HTMLTemplateElement>('#basket'),
    templateBusketItem: ensureElement<HTMLTemplateElement>('#card-basket'),
    templateOrderAdress: ensureElement<HTMLTemplateElement>('#order'),
    templateOrderContact: ensureElement<HTMLTemplateElement>('#contacts'),
    templateSuccess: ensureElement<HTMLTemplateElement>('#success')
}

const api = new ProductApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(DOM.temlateBasket), events);
const orderAddress = new OrderAddress(cloneTemplate(DOM.templateOrderAdress), events);
const orderContact = new OrderContact(cloneTemplate(DOM.templateOrderContact), events);

/**
 * Получение карточек с сервера
 */
events.on('items:chenges', () => {
    page.catalog = appData.catalog.map((item: IProduct) => {
        const card = new Card<ICard>(cloneTemplate(DOM.templateGaleryItem), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            category: item.category,
            image: item.image,
            price: item.price
        })
    })
})

/**
 * Клика по карточке
 */
events.on('card:select', (item: IProduct) => {
    const cardPreciew = new CardPreview(cloneTemplate(DOM.templatePreviewCard), {
        onClick: () => events.emit('add-basket:select', item)
    })

    if (!item.price) {
        cardPreciew.disabled = true
    }

    if (appData.includesBasketItem(item)) {
        cardPreciew.changeBtnName = 'Уже в корзизе';
        cardPreciew.disabled = true;
    }

    return modal.render({
        content: cardPreciew.render({
            category: item.category,
            image: item.image,
            description: item.description,
            price: item.price
        })
    })
})

/**
 * Открытие корзины
 */
events.on('bids:open', () => {
    appData.basket.length ?
        basket.disabled = false :
        basket.disabled = true

    return modal.render({
        content: basket.render({
            total: `${appData.order.total} синапсов`
        })
    })
})

/**
 * Добавления товара в корзину
 */
events.on('add-basket:select', (item: IProduct) => {
    appData.addBasket(item);
    modal.close();
    page.basketCounter = appData.basket.length;

    events.emit('basketItem:change', item);
})

/**
 * Удаления единицы товара из корзины
 */
events.on('card:remove', (item: IProduct) => {
    appData.removeItem(item)
    page.basketCounter = appData.basket.length;

    events.emit('basketItem:change', item);

    appData.basket.length ?
        basket.disabled = false :
        basket.disabled = true

    return modal.render({
        content: basket.render({
            total: `${appData.order.total} синапсов`
        })
    })
})

/**
 * Изменение товаров в корзине
 */
events.on('basketItem:change', () => {
    let counter: number = 0;
    basket.items = appData.basket.map(item => {
        const card = new BasketItem(cloneTemplate(DOM.templateBusketItem), {
            onClick: () => events.emit('card:remove', item)
        })

        counter++;
        return card.render({
            index: counter,
            title: item.title,
            price: item.price
        })
    })
})

/**
 * Оформление заказа (Открытие формы с выбором оплаты и аддресом)
 */
events.on('order:open', () => {
    modal.render({
        content: orderAddress.render({
            address: '',
            payment: 'Онлайн',
            valid: false,
            errors: []
        })
    })
})

/**
 * Выбор оплаты
 */
events.on('selection:payment', (pay: pay) => {
    console.log(pay.payment === 'Онлайн');
    if(pay.payment === 'Онлайн') {
        appData.order.payment = 'Онлайн';
        orderAddress.payment = appData.order.payment;
    } else {
        appData.order.payment = 'При получении';
        orderAddress.payment = appData.order.payment;
    }
})
events.on(/^order\..*:change/, (data: { field: keyof IFormAdress, value: payment }) => {
    appData.setOrderAdress(data.field, data.value);
    appData.order.items
});
events.on('formErrors:change', (errors: Partial<IFormAdress>) => {
    const { address } = errors;
    orderAddress.valid = !address;
    orderAddress.errors = Object.values({ address }).filter(i => !!i).join('; ');
});

/**
 * Оформление заказа (Открытие формы с контактной информацией)
 */
events.on('order:submit', () => {
    modal.render({
        content: orderContact.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    })
})
events.on(/^contacts\..*:change/, (data: { field: keyof IFormContact, value: string }) => {
    appData.setOrderContact(data.field, data.value);
    appData.order.items
});
events.on('formErrors:change', (errors: Partial<IFormContact>) => {
    const { email, phone } = errors;
    orderContact.valid = !phone && !email;
    orderContact.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

/**
 * Отправка заказа, открытие модльного окна с успешным оформлением заказа и обнуление объектов корзины и заказа
 */
events.on('contacts:submit', () => {
    appData.setOrderItems();
    
    api.sendOrder(appData.order)
    .then(res => {
            const success = new Success(cloneTemplate(DOM.templateSuccess), {
                onClick: () => modal.close()
            })

            appData.clearBasket();
            appData.clearOrder();
            page.basketCounter = 0;
            modal.render({
                content: success.render({
                    total: res.total
                })
            })
        })
        .catch(err => console.log(err));
})

/**
 * Блокировка страницы если открыто модальное окно
 */
events.on('modal:open', () => {
    page.locked = true;
});
/**
 * Разблокировка страницы после закрытия модального окна
 */
events.on('modal:close', () => {
    page.locked = false;
});

/**
 * Получение товаров с сервера
 */
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => console.log(err))

/**
 * Мониторинг всех событий для отладки
 */
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})