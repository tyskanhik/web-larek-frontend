import { ProductApi } from './components/ProductApi';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';




const api = new ProductApi(CDN_URL, API_URL);



api.getProductList()
    .then(res => console.log(res))
    .catch(err => console.log(err))