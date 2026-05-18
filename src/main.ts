import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { WebLarekApi } from './components/Communication/WebLarekApi';

import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
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

const header = new Header(document.body, events);
const gallery = new Gallery(document.body);
const modal = new Modal(
    ensureElement<HTMLElement>('#modal-container'),
    events
);

header.render({
    counter: basket.getCount()
});

const previewCard = new PreviewCard(
    cloneTemplate<HTMLElement>('#card-preview'),
    events,
    () => {
        events.emit('card:toggle-basket');
    }
);

const basketView = new BasketView(
    cloneTemplate<HTMLElement>('#basket'),
    events
);

const orderForm = new OrderForm(
    cloneTemplate<HTMLFormElement>('#order'),
    events
);

const contactsForm = new ContactsForm(
    cloneTemplate<HTMLFormElement>('#contacts'),
    events
);

const successView = new Success(
    cloneTemplate<HTMLElement>('#success'),
    events
);

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

function updateBasketView(): void {
    const items = basket.getItems().map((item, index) => {
        const basketCard = new BasketCard(
            cloneTemplate<HTMLElement>('#card-basket'),
            events,
            () => {
                events.emit('basket:remove', { id: item.id });
            }
        );

        return basketCard.render({
            ...item,
            index: index + 1
        });
    });

    basketView.render({
        items,
        total: basket.getTotal(),
        disabled: basket.getCount() === 0
    });
}

function updateOrderForm(): void {
    const buyerData = buyer.getData();
    const errors = buyer.validate();

    orderForm.render({
        payment: buyerData.payment,
        address: buyerData.address,
        valid: isOrderStepValid(errors),
        errors: getOrderStepErrors(errors)
    });
}

function updateContactsForm(): void {
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
    return successView.render({ total });
}

// События моделей данных

events.on('products:changed', () => {
    const cards = productCatalog.getItems().map((item) => {
        const card = new CatalogCard(
            cloneTemplate<HTMLElement>('#card-catalog'),
            events,
            () => {
                productCatalog.setPreview(item);
            }
        );

        return card.render(item);
    });

    gallery.render({
        items: cards
    });
});

events.on('preview:changed', () => {
    const product = productCatalog.getPreview();

    if (!product) {
        return;
    }

    const buttonState = getPreviewButtonState(product);

    previewCard.render({
        ...product,
        buttonText: buttonState.buttonText,
        disabled: buttonState.disabled
    });

    modal.render({
        content: previewCard.render()
    });

    modal.open();
});

events.on('basket:changed', () => {
    header.render({
        counter: basket.getCount()
    });

    updateBasketView();
});

events.on('buyer:changed', () => {
    updateOrderForm();
    updateContactsForm();
});

// События представления

events.on<{ id: string }>('basket:remove', ({ id }) => {
    basket.removeItem(id);
});

events.on('card:toggle-basket', () => {
    const product = productCatalog.getPreview();

    if (!product || product.price === null) {
        return;
    }

    if (basket.hasItem(product.id)) {
        basket.removeItem(product.id);
    } else {
        basket.addItem(product);
    }

    modal.close();
});

events.on('basket:open', () => {
    updateBasketView();

    modal.render({
        content: basketView.render()
    });

    modal.open();
});

events.on('order:open', () => {
    modal.render({
        content: orderForm.render()
    });

    modal.open();
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
    modal.render({
        content: contactsForm.render()
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
        })
        .catch((error) => {
            console.log('Ошибка при оформлении заказа:', error);
        });
});

events.on('success:close', () => {
    modal.close();
});

// Первичная синхронизация статичных представлений
updateBasketView();
updateOrderForm();
updateContactsForm();

// Первичная загрузка каталога с сервера
webLarekApi.getProductList()
    .then((data) => {
        productCatalog.setItems(data.items);
    })
    .catch((error) => {
        console.log('Ошибка при получении товаров с сервера:', error);
    });