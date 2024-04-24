# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание типов

```typescript

type price = number | null;
type category = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'

/**
 * @description Интерфейс продукта поторый приходит с сервера
*/
interface IProduct {
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
interface ICard {
    category: string;
    title: string;
    image: string;
    price: string; // price + ' синопсов'
}

/**
 * @descriptions Интерфейс превью карточки
*/
interface ICardPreview extends ICard {
    description: string
}

/**
 * @description интерфейс корзины
*/
interface IBasket {
    items: HTMLElement[];
    total: string; // price + ' синопсов'
}

/**
 * @description интерфейс единицы товара в корзине
 */
interface IBasketCard {
    index: number;
    title: string;
    price: string; // price + ' синопсов'
}

/**
 * @description интерфейс формы с адрессом доставки и способом оплаты
 */
interface IFormAdress {
    payment: 'Онлайн' | 'При получении';
    adress: string;
}

/**
 * @description интерфейс формы с контактными данными
 */
interface IFormContact {
    email: string;
    phone: string; 
}

/**
 * @description интерфейс с заказом
 */
interface IOrder extends IFormContact, IFormAdress {
    items: string[],
    total: number
}

/**
 * @description Тип ошибки формы
*/
type FormErrors = Partial<Record<keyof IOrder, string>>;

/**
 * @description интерфейс формы после успешной покупки
 */
interface IOrderSuccess {
    total: string; // price + 'синапсов' 
}

/**
 * @description Интерфейс модального окна
*/
interface IModalData {
    content: HTMLElement;
}

/**
 * @description Интерфейс формы
*/
interface IFormState {
    valid: boolean;
    errors: string[];
}

/**
 * @description Интерфейс события
*/
interface IProductAPI {
    getProductList: () => Promise<IProduct[]>
}
```

## Базовые классы

### Класс `Api`

Реализует запросы на сервер
Конструктор принимает такие аргументы:

```typescript
baseUrl: string; // Базовый URL
options: RequestInit = {}; // Объект с загаловками
```

Класс имеет такие методы:

* `get` - Get запрос на сервер для получения данных
* `post` - POST | PUT | DELETE запрос на сервер с передачей данных
* `handleResponse` - Обработчик ошибок после get или post метода

### Класс `Component`
Класс реализует работу с HTML элементами на странице
Контруктор принимает такие аргументы:

```typescript
container: HTMLElement; // Родительский HTML элемент
```
Класс имеет такие методы:

* `toggleClass(element: HTMLElement, className: string, force?: boolean)` — переключает класс
* `setText(element: HTMLElement, value: unknown)` — устанавливает текстовое содержимое
* `setDisabled(element: HTMLElement, state: boolean)` — меняет статус блокировки
* `setHidden(element: HTMLElement)` — делает скрытым
* `setVisible(element: HTMLElement)` — делает видимым
* `setImage(element: HTMLImageElement, src: string, alt?: string)` — устанавливает изображение с алтернативным текстом
* `render(data?: Partial<T>)` — возвращает корневой DOM-элемент

### Класс `EventEmitter`

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события.
Класс имеет методы `on` ,  `off` ,  `emit`  — для подписки на событие, отписки от события и уведомления
подписчиков о наступлении события.
Дополнительно реализованы методы  `onAll` и  `offAll`  — для подписки на все события и сброса всех
подписчиков.
Присутствует метод  `trigger` , генерирующий заданное событие с заданными
аргументами. Это позволяет передавать его в качестве обработчика события в другие классы.

### Класс `Model`

Реализует создание модели данных
Контруктор принимает такие аргументы:

```typescript
data: Partial<T>; Объект с данными
events: IEvents; Объект событий
```
Класс имеет такие методы:

* `emitChanges(event: string, payload?: object)` - сообщает всем что модель поменялась

## Модели данных 
### Класс `AppState`

Реализует хранение состояния приложения

Класс имеет такие методы:

* `setCatalog(items: IProduct[])` - Каталог товаров
* `addbasket(item: IProduct)` - Добавить товар в корзину
* `removeItemBasket(item: IProduct)` - Удалить товар из корзины
* `cleareBasket()` - Очистить корзину
* `getTotal()` - Расчет общей суммы
* `setOrderAdress(field: keyof IFormAdress, value: string)` - Сохренение данных адресса и способа оплаты
* `setOrderContact(field: keyof IFormContact, value: string)` - Сохранение контактных данных
* `validateOrderAdress()` - Валидация формы с адрессом и способом оплаты
* `validateOrderContact()` - валидация формы с контактными данными

## Модели представления
### Класс `Page extends Component<IPage>`

Реализует добавление на страницу карточек с товарами, вешает слушатель на иконку корзины и отслеживает колличество товаров в корзине
Контруктор принимает такие аргументы:
```typescript
container: HTMLElement; Родительский HTML элемент
events: IEvents; Объект событий
```

Класс имеет такие методы:
* `set locked(value: boolean)` - Блокирует страницу при открытии модального окна
* `set basketCounter(value: number)` - Счетчик количества товаров в корзине
* `set catalog(items: HTMLElement[])` - Добавление карточкек на главную страницу

### Класс `Card<T> extends Component<ICard> implements ICard`
Реализует создание карточки
Конструктор принимает такие аргументы:
```typescript
container: HTMLElement; Родительский HTML элемент
actions?: ICardActions; Установка события
```

Класс имеет такие методы:
* `set title(value: string)` - Утанавливает заголовок
* `set category(value: string)` - Устанавливает категорию
* `set image(value: string)` - Устанавливает изображение
* `set price(value: number | null)` -Устанавливает цену

### Класс `CardPreview extends Card<ICardModal> implements ICardPreview`
Реализует создание  карточки в модальном окне
Конструктор принимает такие аргументы:
```typescript
container: HTMLElement; Родительский HTML элемент
actions?: ICardActions; Установка события
```

Класс имеет такие методы:
* `set description(value: string)` - Устанавлиет описание
* `set changeBtnName(value: string)` - Изменяет текст кнопки после добавления товара в корзину

### Класс `Basket extends Component<IBasket>`
Реализует создание корзины
Контруктор принимает такие аргументы:
```typescript
container: HTMLElement; Родительский HTML элемент
events: IEvents; Объект событий
```

Класс имеет такие методы:
* `set items(items: HTMLElement[])` - Создает список товаров в корзине
* `set total(value: number)` - Устанавливает общую стоимость товаров

### Класс `BasketItem extends Basket`
Реализует создание единицы товара в корзине
Конструктор принимает такие аргументы:
```typescript
container: HTMLElement; Родительский HTML элемент
actions?: ICardActions; Установка события
```

Класс имеет такие методы:
* `set index(value: number)` - Устанавливает порядковый номер товара

### Класс `Modal extends Component<IModalData>`
Реализует создание модального окна
Контруктор принимает такие аргументы:
```typescript
container: HTMLElement; Родительский HTML элемент
events: IEvents; Объект событий
```

Класс имеет такие методы:
* `set content(value: HTMLElement)` - Устанавливает контент в модальное окно
* `open()` - Открывает модальное окно
* `Close()` - Закрывает модальное окно
* `render(data: IModalData): HTMLElement` - Создает модальное окно с установленным контентом


### Класс `Form extends Component<IFormState>`
Реализует создание формы
Контруктор принимает такие аргументы:
```typescript
container: HTMLElement; Родительский HTML элемент
events: IEvents; Объект событий
```

Класс имеет такие методы:
* ` set valid(value: boolean)` - Устанавливает блокировку кнопки
* `set errors(value: string)` - Устанавливает тект ошибки
* `onInputChange(field: keyof T, value: string)` - Валидация формы
* ` render(state: Partial<T> & IFormState)` - Создает окно с формой

### Класс `OrderAdress extends Form<IFormAdress>`
Реализует отображение формы с выбором оплаты и отправкой адресса
Контруктор принимает такие аргументы:
```typescript
container: HTMLElement; Родительский HTML элемент
events: IEvents; Объект событий
```

Класс имеет такие методы:

### Класс `OrderContact extends Form<IFormContact>`
Реализует отображение формы с контактнй информацией
Контруктор принимает такие аргументы:
```typescript
container: HTMLElement; Родительский HTML элемент
events: IEvents; Объект событий
```
*  `set payment(value: string)` - Устанавливает выбор оплаты
*  `set adress(value: string)` - Устанавливает адресс

Класс имеет такие методы:
* ` set phone(value: string)` - Устанавливает номер телефона
*  ` set phone(value: string)` - Устанавливает email

### Класс `Success extends Component<IOrderSuccess>`
Реализует создание окна об успешном оформлении заказа
Контруктор принимает такие аргументы:
```typescript
container: HTMLElement; Родительский HTML элемент
events: IEvents; Объект событий
```

Класс имеет такие методы:
* `set total(total: string)` - Колличесво списаных средсв

### Класс `ProductAPI extends Api implements IProductAPI`
Реализует запросы на определенный API
Контруктор принимает такие аргументы:
```typescript
cdn: string; // Адрес сервера с картинками для карточек
baseUrl: string; // Базовый URL
options?: RequestInit; // 
```

Класс имеет такие методы:
* `getProductList(): Promise<IProduct[]>` - Получает массив с товарами
* `submittingOrder(value: IOrder): Promise<IOrderResult>` - Отправляет форму с заказом

