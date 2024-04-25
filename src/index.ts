import { AppState } from './components/AppData';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { ProductApi } from './components/ProductApi';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { ICard, IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';


const DOM = {
    templateGaleryItem: ensureElement<HTMLTemplateElement>('#card-catalog'),
    templateModalCard: ensureElement<HTMLTemplateElement>('#card-preview'),
    temlateBasket: ensureElement<HTMLTemplateElement>('#basket'),
    templateBusketItem: ensureElement<HTMLTemplateElement>('#card-basket'),
    templateOrderAdress: ensureElement<HTMLTemplateElement>('#order'),
    templateOrderContact: ensureElement<HTMLTemplateElement>('#contacts')
}

const api = new ProductApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppState({}, events)


const page = new Page(document.body, events)


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



api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => console.log(err))

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})