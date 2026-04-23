import './scss/styles.scss';

import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { WebLarekApi } from './components/Communication/WebLarekApi';

const productCatalog = new ProductCatalog();
const basket = new Basket();
const buyer = new Buyer();

// Проверка ProductCatalog
productCatalog.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productCatalog.getItems());

const firstProduct = apiProducts.items[0];
console.log('Товар по id:', productCatalog.getItemById(firstProduct.id));

productCatalog.setPreview(firstProduct);
console.log('Товар для подробного просмотра:', productCatalog.getPreview());

// Проверка Basket
basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);
basket.addItem(apiProducts.items[2]);

console.log('Товары в корзине:', basket.getItems());
console.log('Общая стоимость корзины:', basket.getTotal());
console.log('Количество товаров в корзине:', basket.getCount());
console.log('Проверка наличия товара в корзине:', basket.hasItem(apiProducts.items[1].id));

basket.removeItem(apiProducts.items[1].id);
console.log('Корзина после удаления товара:', basket.getItems());

basket.clear();
console.log('Корзина после очистки:', basket.getItems());

// Проверка Buyer
console.log('Покупатель до заполнения:', buyer.getData());
console.log('Ошибки валидации до заполнения:', buyer.validate());

buyer.setData({
    payment: 'online',
    email: 'test@test.ru'
});
console.log('Покупатель после частичного заполнения:', buyer.getData());
console.log('Ошибки валидации после частичного заполнения:', buyer.validate());

buyer.setData({
    phone: '+71234567890',
    address: 'Санкт-Петербург, Невский проспект, 1'
});
console.log('Покупатель после полного заполнения:', buyer.getData());
console.log('Ошибки валидации после полного заполнения:', buyer.validate());

buyer.clear();
console.log('Покупатель после очистки:', buyer.getData());
console.log('Ошибки валидации после очистки:', buyer.validate());

// Проверка слоя коммуникации
const baseApi = new Api(API_URL);
const webLarekApi = new WebLarekApi(baseApi);

webLarekApi.getProductList()
    .then((data) => {
        productCatalog.setItems(data.items);
        console.log('Каталог товаров, полученный с сервера:', productCatalog.getItems());
    })
    .catch((error) => {
        console.log('Ошибка при получении товаров с сервера:', error);
    });