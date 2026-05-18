# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TypeScript, Vite

## Структура проекта

- `src/` — исходные файлы проекта
- `src/components/` — компоненты приложения
- `src/components/base/` — базовые классы
- `src/components/Models/` — модели данных
- `src/components/View/` — компоненты представления
- `src/components/Communication/` — коммуникационный слой
- `src/types/` — типы данных
- `src/utils/` — утилиты и константы

## Важные файлы

- `index.html` — HTML-файл главной страницы
- `src/main.ts` — точка входа и реализация презентера
- `src/types/index.ts` — типы данных приложения
- `src/utils/constants.ts` — константы
- `src/utils/utils.ts` — утилиты
- `src/scss/styles.scss` — корневой файл стилей

## Установка и запуск

Для установки зависимостей:

npm install

Для запуска проекта в режиме разработки:

npm run dev

Для сборки проекта:

npm run build

## Описание проекта

Web-Larek — это интернет-магазин с товарами для веб-разработчиков.
Пользователь может:

- просматривать каталог товаров;
- открывать подробную карточку товара;
- добавлять товары в корзину и удалять их;
- оформлять заказ в два шага;
- отправлять заказ на сервер;
- получать сообщение об успешном оформлении.

# Архитектура приложения

Проект построен по паттерну MVP (Model-View-Presenter).

## Model

Слой данных.
Отвечает за хранение и изменение состояния приложения.

## View

Слой представления.
Отвечает только за отображение интерфейса и генерацию событий при действиях пользователя.

## Presenter

Связывает модели и представления.
Подписывается на события, вызывает методы моделей, подготавливает данные и передает их во View.

В данном проекте презентер реализован в файле `src/main.ts`, без выделения в отдельный класс, так как приложение состоит из одной страницы.

# Базовый код

## Класс `Component<T>`

Базовый класс для всех компонентов представления.

### Конструктор

`constructor(container: HTMLElement)`

Принимает корневой DOM-элемент компонента.

### Поля

- `container: HTMLElement` — корневой DOM-элемент компонента.

### Методы

- `render(data?: Partial<T>): HTMLElement` — записывает переданные данные в поля компонента и возвращает корневой DOM-элемент.
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` — утилитарный метод для установки изображения.

## Класс `Api`

Базовый класс для HTTP-запросов.

### Конструктор

`constructor(baseUrl: string, options: RequestInit = {})`

### Поля

- `baseUrl: string` — базовый адрес сервера.
- `options: RequestInit` — объект параметров запроса.

### Методы

- `get<T extends object>(uri: string): Promise<T>` — выполняет GET-запрос.
- `post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>` — выполняет POST/PUT/DELETE-запрос.
- `handleResponse<T>(response: Response): Promise<T>` — обрабатывает ответ сервера.

## Класс `EventEmitter`

Брокер событий, реализующий паттерн «Наблюдатель».

### Конструктор

`constructor()`

### Поля

- `_events: Map<EventName, Set<Subscriber>>` — коллекция подписок.

### Методы

- `on<T>(eventName: EventName, callback: (event: T) => void): void` — подписка на событие.
- `off(eventName: EventName, callback: Subscriber): void` — удаление подписки.
- `emit<T>(eventName: string, data?: T): void` — генерация события.
- `onAll(callback: (event: EmitterEvent) => void): void` — подписка на все события.
- `offAll(): void` — очистка подписок.
- `trigger<T>(eventName: string, context?: Partial<T>): (data: object) => void` — создает функцию-триггер события.

# Данные

## Тип `TPayment`

`type TPayment = 'online' | 'cash';`

Тип способа оплаты.

## Интерфейс `IProduct`

`interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}`

Описывает товар каталога.

## Интерфейс `IBuyer`

`interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}`

Описывает данные покупателя.

## Тип `TBuyerErrors`

`type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;`

Описывает объект ошибок валидации данных покупателя.

## Интерфейс `IProductListResponse`

`interface IProductListResponse {
    total: number;
    items: IProduct[];
}`

Ответ сервера со списком товаров.

## Интерфейс `IOrderRequest`

`interface IOrderRequest extends IBuyer {
    total: number;
    items: string[];
}`

Объект заказа, который отправляется на сервер.

## Интерфейс `IOrderResponse`

`interface IOrderResponse {
    id: string;
    total: number;
}`

Ответ сервера после успешного оформления заказа.

## Интерфейс `IApi`

`interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}`

Интерфейс для классов, выполняющих HTTP-запросы.

# Модели данных

## Класс `ProductCatalog`

Отвечает за хранение каталога товаров и выбранного товара для подробного просмотра.

### Конструктор

`constructor(events: IEvents)`

### Поля

- `_items: IProduct[]` — массив товаров.
- `_preview: IProduct | null` — выбранный товар.
- `events: IEvents` — брокер событий.

### Методы

- `setItems(items: IProduct[]): void` — сохраняет массив товаров и генерирует событие `products:changed`.
- `getItems(): IProduct[]` — возвращает массив товаров.
- `getItemById(id: string): IProduct | undefined` — возвращает товар по id.
- `setPreview(item: IProduct): void` — сохраняет выбранный товар и генерирует событие `preview:changed`.
- `getPreview(): IProduct | null` — возвращает выбранный товар.

## Класс `Basket`

Отвечает за хранение товаров, добавленных в корзину.

### Конструктор

`constructor(events: IEvents)`

### Поля

- `_items: IProduct[]` — товары в корзине.
- `events: IEvents` — брокер событий.

### Методы

- `getItems(): IProduct[]` — возвращает товары корзины.
- `addItem(item: IProduct): void` — добавляет товар и генерирует событие `basket:changed`.
- `removeItem(id: string): void` — удаляет товар и генерирует событие `basket:changed`.
- `clear(): void` — очищает корзину и генерирует событие `basket:changed`.
- `getTotal(): number` — возвращает общую стоимость.
- `getCount(): number` — возвращает количество товаров.
- `hasItem(id: string): boolean` — проверяет наличие товара в корзине.

## Класс `Buyer`

Отвечает за хранение, изменение и валидацию данных покупателя.

### Конструктор

`constructor(events: IEvents)`

### Поля

- `_payment: TPayment | null` — способ оплаты.
- `_email: string` — email.
- `_phone: string` — телефон.
- `_address: string` — адрес доставки.
- `events: IEvents` — брокер событий.

### Методы

- `setData(data: Partial<IBuyer>): void` — частично обновляет данные покупателя и генерирует событие `buyer:changed`.
- `getData(): IBuyer` — возвращает данные покупателя.
- `clear(): void` — очищает данные и генерирует событие `buyer:changed`.
- `validate(): TBuyerErrors` — возвращает объект ошибок валидации.

# Слой коммуникации

## Класс `WebLarekApi`

Отвечает за взаимодействие с сервером.

### Конструктор

`constructor(api: IApi)`

### Поля

- `api: IApi` — объект для выполнения HTTP-запросов.

### Методы

- `getProductList(): Promise<IProductListResponse>` — получает список товаров с эндпоинта `/product/`.
- `createOrder(order: IOrderRequest): Promise<IOrderResponse>` — отправляет заказ на эндпоинт `/order`.

# Слой представления

## Класс `Header`

Отвечает за отображение кнопки корзины и счетчика товаров.

### Конструктор

`constructor(container: HTMLElement, events: IEvents)`

### Поля

- `events: IEvents` — брокер событий.
- `_basketButton: HTMLButtonElement` — кнопка корзины.
- `_basketCounter: HTMLElement` — счетчик корзины.

### Методы

- `set counter(value: number)` — обновляет счетчик.
- `render(data?: Partial<IHeader>): HTMLElement` — возвращает DOM-элемент хедера.

### События

- при клике по кнопке корзины генерирует `basket:open`.

## Класс `Gallery`

Отвечает за отображение каталога карточек товаров.

### Конструктор

`constructor(container: HTMLElement)`

### Поля

- `_gallery: HTMLElement` — контейнер галереи.

### Методы

- `set items(value: HTMLElement[])` — заменяет содержимое галереи.
- `render(data?: Partial<IGallery>): HTMLElement` — возвращает DOM-элемент галереи.

## Класс `Card`

Базовый класс карточки товара.

### Конструктор

`constructor(container: HTMLElement, events: IEvents)`

### Поля

- `events: IEvents` — брокер событий.
- `_title: HTMLElement` — название товара.
- `_price: HTMLElement` — цена товара.

### Методы

- `set title(value: string)` — устанавливает название.
- `set price(value: number | null)` — устанавливает цену.

## Класс `CatalogCard`

Карточка товара в каталоге.

### Конструктор

`constructor(container: HTMLElement, events: IEvents, onClick: () => void)`

### Поля

- `_category: HTMLElement` — категория.
- `_image: HTMLImageElement` — изображение.
- `onClick: () => void` — колбэк выбора карточки.

### Методы

- `set category(value: string)` — устанавливает категорию.
- `set image(value: string)` — устанавливает изображение.
- `render(data?: Partial<IProduct>): HTMLElement` — возвращает готовую карточку.

## Класс `PreviewCard`

Подробная карточка товара.

### Конструктор

`constructor(container: HTMLElement, events: IEvents, onToggleBasket: () => void)`

### Поля

- `_category: HTMLElement` — категория.
- `_image: HTMLImageElement` — изображение.
- `_description: HTMLElement` — описание.
- `_button: HTMLButtonElement` — кнопка действия.
- `onToggleBasket: () => void` — колбэк добавления/удаления товара.

### Методы

- `set category(value: string)` — устанавливает категорию.
- `set image(value: string)` — устанавливает изображение.
- `set description(value: string)` — устанавливает описание.
- `set buttonText(value: string)` — устанавливает текст кнопки.
- `set disabled(value: boolean)` — блокирует/разблокирует кнопку.
- `render(data?: Partial<IPreviewCardData>): HTMLElement` — возвращает карточку.

## Класс `BasketCard`

Карточка товара в корзине.

### Конструктор

`constructor(container: HTMLElement, events: IEvents, onDelete: () => void)`

### Поля

- `_index: HTMLElement` — номер товара в корзине.
- `_deleteButton: HTMLButtonElement` — кнопка удаления.
- `onDelete: () => void` — колбэк удаления.

### Методы

- `set index(value: number)` — устанавливает индекс.
- `render(data?: Partial<IBasketCardData>): HTMLElement` — возвращает карточку корзины.

## Класс `BasketView`

Отвечает за отображение корзины.

### Конструктор

`constructor(container: HTMLElement, events: IEvents)`

### Поля

- `events: IEvents` — брокер событий.
- `_list: HTMLElement` — список товаров.
- `_total: HTMLElement` — общая стоимость.
- `_button: HTMLButtonElement` — кнопка оформления.

### Методы

- `set items(value: HTMLElement[])` — обновляет список товаров.
- `set total(value: number)` — обновляет общую стоимость.
- `set disabled(value: boolean)` — блокирует кнопку оформления.
- `render(data?: Partial<IBasketView>): HTMLElement` — возвращает корзину.

### События

- при клике по кнопке оформления генерирует `order:open`.

## Класс `Modal`

Отвечает за работу модального окна.

### Конструктор

`constructor(container: HTMLElement, events: IEvents)`

### Поля

- `events: IEvents` — брокер событий.
- `_closeButton: HTMLButtonElement` — кнопка закрытия.
- `_content: HTMLElement` — контейнер содержимого модального окна.

### Методы

- `set content(value: HTMLElement)` — заменяет содержимое модального окна.
- `open(): void` — открывает модальное окно.
- `close(): void` — закрывает модальное окно.
- `render(data?: Partial<IModalData>): HTMLElement` — возвращает модальное окно.

### События

- `modal:open` — открытие модального окна.
- `modal:close` — закрытие модального окна.

## Класс `Form<T>`

Базовый класс формы.

### Конструктор

`constructor(container: HTMLFormElement, events: IEvents)`

### Поля

- `events: IEvents` — брокер событий.
- `_submitButton: HTMLButtonElement` — кнопка отправки.
- `_errors: HTMLElement` — блок вывода ошибок.
- `_inputs: HTMLInputElement[]` — поля ввода.
- `_formName: string` — имя формы.

### Методы

- `set valid(value: boolean)` — управляет активностью кнопки.
- `set errors(value: string)` — устанавливает текст ошибок.
- `render(data?: Partial<T & IFormState>): HTMLFormElement` — возвращает форму.

### События

- при вводе генерирует событие вида `${formName}.${field}:change`
- при submit генерирует событие `${formName}:submit`

## Класс `OrderForm`

Форма первого шага оформления заказа.

### Конструктор

`constructor(container: HTMLFormElement, events: IEvents)`

### Поля

- `_cardButton: HTMLButtonElement` — кнопка оплаты онлайн.
- `_cashButton: HTMLButtonElement` — кнопка оплаты при получении.
- `_addressInput: HTMLInputElement` — поле адреса.

### Методы

- `set payment(value: TPayment | null)` — отображает выбранный способ оплаты.
- `set address(value: string)` — устанавливает адрес.

### События

- `order.payment:change` — изменение способа оплаты.
- `order.address:change` — изменение адреса.
- `order:submit` — переход ко второй форме.

## Класс `ContactsForm`

Форма второго шага оформления заказа.

### Конструктор

`constructor(container: HTMLFormElement, events: IEvents)`

### Поля

- `_emailInput: HTMLInputElement` — поле email.
- `_phoneInput: HTMLInputElement` — поле телефона.

### Методы

- `set email(value: string)` — устанавливает email.
- `set phone(value: string)` — устанавливает телефон.

### События

- `contacts.email:change` — изменение email.
- `contacts.phone:change` — изменение телефона.
- `contacts:submit` — завершение оформления.

## Класс `Success`

Сообщение об успешном оформлении заказа.

### Конструктор

`constructor(container: HTMLElement, events: IEvents)`

### Поля

- `events: IEvents` — брокер событий.
- `_description: HTMLElement` — текст с итоговой суммой.
- `_closeButton: HTMLButtonElement` — кнопка закрытия.

### Методы

- `set total(value: number)` — устанавливает итоговую сумму.
- `render(data?: Partial<ISuccess>): HTMLElement` — возвращает сообщение об успехе.

### События

- `success:close` — закрытие окна успеха.

# События приложения

## События моделей

- `products:changed` — изменён каталог товаров.
- `preview:changed` — изменён выбранный товар.
- `basket:changed` — изменено содержимое корзины.
- `buyer:changed` — изменены данные покупателя.

## События представления

- `basket:open` — открыть корзину.
- `basket:remove` — удалить товар из корзины.
- `card:toggle-basket` — добавить или удалить товар из корзины из подробной карточки.
- `order:open` — открыть форму заказа.
- `order.payment:change` — изменить способ оплаты.
- `order.address:change` — изменить адрес.
- `order:submit` — перейти ко второму шагу оформления.
- `contacts.email:change` — изменить email.
- `contacts.phone:change` — изменить телефон.
- `contacts:submit` — завершить оформление заказа.
- `modal:open` — открытие модального окна.
- `modal:close` — закрытие модального окна.
- `success:close` — закрытие окна успешного заказа.

# Презентер

Презентер реализован в файле `src/main.ts`.

Он отвечает за:

- создание экземпляров моделей, представлений и API-класса;
- подписку на события моделей и представлений;
- обновление интерфейса при изменении моделей;
- обработку пользовательских действий;
- загрузку каталога товаров;
- сборку и отправку заказа на сервер.

Презентер не хранит состояние приложения отдельно от моделей и не генерирует собственных событий. Он только обрабатывает уже возникшие события и вызывает нужные методы моделей и представлений.

## Логика работы презентера

1. При загрузке приложения выполняется запрос на сервер за списком товаров.
2. После получения ответа товары сохраняются в `ProductCatalog`.
3. Событие `products:changed` приводит к отрисовке галереи.
4. При выборе товара в каталоге выбранный товар сохраняется в модель каталога.
5. Событие `preview:changed` открывает подробную карточку товара.
6. При добавлении или удалении товара обновляется модель корзины.
7. Событие `basket:changed` обновляет счетчик корзины и содержимое корзины.
8. При изменении данных покупателя обновляются формы оформления.
9. При отправке второй формы собирается объект заказа и отправляется на сервер.
10. После успешного заказа корзина очищается, данные покупателя сбрасываются, отображается окно успеха.