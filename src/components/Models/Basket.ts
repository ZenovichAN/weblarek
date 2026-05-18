import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Basket {
    protected _items: IProduct[];
    protected events: IEvents;

    constructor(events: IEvents) {
        this._items = [];
        this.events = events;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        this._items.push(item);
        this.events.emit('basket:changed', { items: this._items });
    }

    removeItem(id: string): void {
        this._items = this._items.filter((item) => item.id !== id);
        this.events.emit('basket:changed', { items: this._items });
    }

    clear(): void {
        this._items = [];
        this.events.emit('basket:changed', { items: this._items });
    }

    getTotal(): number {
        return this._items.reduce((total, item) => total + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this._items.length;
    }

    hasItem(id: string): boolean {
        return this._items.some((item) => item.id === id);
    }
}