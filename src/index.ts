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
import { OrderAddress, OrderContact } from './components/Order';


const DOM = {
    templateGaleryItem: ensureElement<HTMLTemplateElement>('#card-catalog'),
    templatePreviewCard: ensureElement<HTMLTemplateElement>('#card-preview'),
    temlateBasket: ensureElement<HTMLTemplateElement>('#basket'),
    templateBusketItem: ensureElement<HTMLTemplateElement>('#card-basket'),
    templateOrderAdress: ensureElement<HTMLTemplateElement>('#order'),
    templateOrderContact: ensureElement<HTMLTemplateElement>('#contacts')
}

const api = new ProductApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppState({}, events);


const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(DOM.temlateBasket), events);
const orderAdress = new OrderAddress(cloneTemplate(DOM.templateOrderAdress), events);
const orderContact = new OrderContact(cloneTemplate(DOM.templateOrderContact), events);

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

events.on('card:select', (item: IProduct) => {
    const cardPreciew = new CardPreview(cloneTemplate(DOM.templatePreviewCard), {
        onClick: () => events.emit('add-basket:select', item)
    })
    
    if(!item.price) {
        cardPreciew.disabled = true
    }

    if(appData.basket.includes(item)) {
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

events.on('add-basket:select', (item: IProduct) => {
    appData.basket.push(item);
    appData.order.items.push(item.id)
    modal.close();
    page.basketCounter = appData.basket.length;
    appData.total = item.price;
})

events.on('bids:open', () => {
    appData.basket.length ?
        basket.disabled = false :
        basket.disabled = true

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

    return modal.render({
        content: basket.render({
            total: `${appData.total} синапсов`
        })
    })
})

events.on('card:remove', (item: IProduct) => {
    appData.removeItem(item)
    page.basketCounter = appData.basket.length;
    appData.total = -item.price
    
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

    appData.basket.length ?
    basket.disabled = false :
    basket.disabled = true
    
    return modal.render({
        content: basket.render({
            total: `${appData.order.total} синапсов`
        })
    })
})

events.on('order:open', () => {
    modal.render({
        content: orderAdress.render({
            address: '',
            payment: 'Онлайн',
            valid: false,
            errors: []
        })
    })
})
events.on('selection:card', () => {
    appData.order.payment = 'Онлайн';
    orderAdress.payment = appData.order.payment;
})
events.on('selection:cash', () => {
    appData.order.payment = 'При получении';
    orderAdress.payment = appData.order.payment;
})
events.on(/^order\..*:change/, (data: { field: keyof IFormAdress, value: payment }) => {
    appData.setOrderAdress(data.field, data.value);
    appData.order.items
});
events.on('formErrors:change', (errors: Partial<IFormAdress>) => {
    const { address } = errors;
    orderAdress.valid = !address;
    orderAdress.errors = Object.values({ address }).filter(i => !!i).join('; ');   
});



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



// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => console.log(err))

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})