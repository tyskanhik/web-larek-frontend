import { AppState } from './components/AppData';
import { ProductApi } from './components/ProductApi';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';




const api = new ProductApi(CDN_URL, API_URL);
const event = new EventEmitter();
const appData = new AppState({}, event)


event.on('items:chenges', () => {
    appData.catalog.map(item => console.log(item))
})



api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => console.log(err))