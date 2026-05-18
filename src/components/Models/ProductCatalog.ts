import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductCatalog {
    protected _items: IProduct[];
    protected _preview: IProduct | null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this._items = [];
        this._preview = null;
        this.events = events;
    }

    setItems(items: IProduct[]): void {
        this._items = items;
        this.events.emit('products:changed', { items: this._items });
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItemById(id: string): IProduct | undefined {
        return this._items.find((item) => item.id === id);
    }

    setPreview(item: IProduct): void {
        this._preview = item;
        this.events.emit('preview:changed', { item: this._preview });
    }

    getPreview(): IProduct | null {
        return this._preview;
    }
}