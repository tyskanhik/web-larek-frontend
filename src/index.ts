import './scss/styles.scss';
import { AppState } from './components/AppData';
import { Card, CardPreview } from './components/Card';
import { Page } from './components/Page';
import { ProductApi } from './components/ProductApi';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { ICard, IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Basket } from './components/Basket';


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

    return modal.render({
        content: cardPreciew.render({
            category: item.category,
            image: item.image,
            description: item.description,
            price: item.price
        })
    })
})

events.on('bids:open', () => {
    return modal.render({
        content: basket.render()
    })
})


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