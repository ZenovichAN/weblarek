import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { WebLarekApi } from './components/Communication/WebLarekApi';

import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { CatalogCard } from './components/View/CatalogCard';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketCard } from './components/View/BasketCard';
import { BasketView } from './components/View/BasketView';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';

import { IBuyer, IOrderRequest, IProduct, TBuyerErrors } from './types';

const events = new EventEmitter();

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const productCatalog = new ProductCatalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const page = new Page(document.body, events);
const modal = new Modal(
    ensureElement<HTMLElement>('#modal-container'),
    events
);

let orderForm: OrderForm | null = null;
let contactsForm: ContactsForm | null = null;

function getOrderStepErrors(errors: TBuyerErrors): string {
    return [errors.payment, errors.address].filter(Boolean).join('; ');
}

function getContactsStepErrors(errors: TBuyerErrors): string {
    return [errors.email, errors.phone].filter(Boolean).join('; ');
}

function isOrderStepValid(errors: TBuyerErrors): boolean {
    return !errors.payment && !errors.address;
}

function isContactsStepValid(errors: TBuyerErrors): boolean {
    return !errors.email && !errors.phone;
}

function getPreviewButtonState(product: IProduct): { buttonText: string; disabled: boolean } {
    if (product.price === null) {
        return {
            buttonText: 'Недоступно',
            disabled: true
        };
    }

    if (basket.hasItem(product.id)) {
        return {
            buttonText: 'Удалить из корзины',
            disabled: false
        };
    }

    return {
        buttonText: 'Купить',
        disabled: false
    };
}

function renderBasketContent(): HTMLElement {
    const basketView = new BasketView(
        cloneTemplate<HTMLElement>('#basket'),
        events
    );

    const items = basket.getItems().map((item, index) => {
        const basketCard = new BasketCard(
            cloneTemplate<HTMLElement>('#card-basket'),
            events
        );

        return basketCard.render({
            ...item,
            index: index + 1
        });
    });

    return basketView.render({
        items,
        total: basket.getTotal(),
        disabled: basket.getCount() === 0
    });
}

function createOrderForm(): HTMLElement {
    orderForm = new OrderForm(
        cloneTemplate<HTMLFormElement>('#order'),
        events
    );

    const buyerData = buyer.getData();
    const errors = buyer.validate();

    return orderForm.render({
        payment: buyerData.payment,
        address: buyerData.address,
        valid: isOrderStepValid(errors),
        errors: getOrderStepErrors(errors)
    });
}

function updateOrderForm(): void {
    if (!orderForm) {
        return;
    }

    const buyerData = buyer.getData();
    const errors = buyer.validate();

    orderForm.render({
        payment: buyerData.payment,
        address: buyerData.address,
        valid: isOrderStepValid(errors),
        errors: getOrderStepErrors(errors)
    });
}

function createContactsForm(): HTMLElement {
    contactsForm = new ContactsForm(
        cloneTemplate<HTMLFormElement>('#contacts'),
        events
    );

    const buyerData = buyer.getData();
    const errors = buyer.validate();

    return contactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone,
        valid: isContactsStepValid(errors),
        errors: getContactsStepErrors(errors)
    });
}

function updateContactsForm(): void {
    if (!contactsForm) {
        return;
    }

    const buyerData = buyer.getData();
    const errors = buyer.validate();

    contactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone,
        valid: isContactsStepValid(errors),
        errors: getContactsStepErrors(errors)
    });
}

function renderSuccess(total: number): HTMLElement {
    const success = new Success(
        cloneTemplate<HTMLElement>('#success'),
        events
    );

    return success.render({ total });
}

// События моделей данных

events.on('products:changed', () => {
    const cards = productCatalog.getItems().map((item) => {
        const card = new CatalogCard(
            cloneTemplate<HTMLElement>('#card-catalog'),
            events
        );

        return card.render(item);
    });

    page.render({
        gallery: cards,
        counter: basket.getCount()
    });
});

events.on('preview:changed', () => {
    const product = productCatalog.getPreview();

    if (!product) {
        return;
    }

    const preview = new PreviewCard(
        cloneTemplate<HTMLElement>('#card-preview'),
        events
    );

    const buttonState = getPreviewButtonState(product);

    modal.render({
        content: preview.render({
            ...product,
            buttonText: buttonState.buttonText,
            disabled: buttonState.disabled
        })
    });

    modal.open();
});

events.on('basket:changed', () => {
    page.counter = basket.getCount();
});

events.on('buyer:changed', () => {
    updateOrderForm();
    updateContactsForm();
});

// События представления

events.on<{ id: string }>('card:select', ({ id }) => {
    const product = productCatalog.getItemById(id);

    if (!product) {
        return;
    }

    productCatalog.setPreview(product);
});

events.on<{ id: string }>('card:toggle-basket', ({ id }) => {
    const product = productCatalog.getItemById(id);

    if (!product || product.price === null) {
        return;
    }

    if (basket.hasItem(id)) {
        basket.removeItem(id);
    } else {
        basket.addItem(product);
    }

    modal.close();
});

events.on('basket:open', () => {
    modal.render({
        content: renderBasketContent()
    });

    modal.open();
});

events.on<{ id: string }>('basket:remove', ({ id }) => {
    basket.removeItem(id);

    modal.render({
        content: renderBasketContent()
    });
});

events.on('order:open', () => {
    modal.render({
        content: createOrderForm()
    });
});

events.on<{ value: string }>('order.payment:change', ({ value }) => {
    buyer.setData({
        payment: value as IBuyer['payment']
    });
});

events.on<{ value: string }>('order.address:change', ({ value }) => {
    buyer.setData({
        address: value
    });
});

events.on('order:submit', () => {
    if (!isOrderStepValid(buyer.validate())) {
        updateOrderForm();
        return;
    }

    modal.render({
        content: createContactsForm()
    });
});

events.on<{ value: string }>('contacts.email:change', ({ value }) => {
    buyer.setData({
        email: value
    });
});

events.on<{ value: string }>('contacts.phone:change', ({ value }) => {
    buyer.setData({
        phone: value
    });
});

events.on('contacts:submit', () => {
    const errors = buyer.validate();

    if (!isContactsStepValid(errors)) {
        updateContactsForm();
        return;
    }

    const buyerData = buyer.getData();

    if (!buyerData.payment) {
        return;
    }

    const orderData: IOrderRequest = {
        payment: buyerData.payment,
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: basket.getTotal(),
        items: basket.getItems().map((item) => item.id)
    };

    webLarekApi.createOrder(orderData)
        .then((response) => {
            modal.render({
                content: renderSuccess(response.total)
            });

            basket.clear();
            buyer.clear();
            orderForm = null;
            contactsForm = null;
        })
        .catch((error) => {
            console.log('Ошибка при оформлении заказа:', error);
        });
});

events.on('success:close', () => {
    modal.close();
    orderForm = null;
    contactsForm = null;
});

// Первичная загрузка каталога с сервера
webLarekApi.getProductList()
    .then((data) => {
        productCatalog.setItems(data.items);
    })
    .catch((error) => {
        console.log('Ошибка при получении товаров с сервера:', error);
    });