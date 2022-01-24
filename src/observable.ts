import { Event } from './event.js';

export type observer = { (observable:Observable, event:any): void; };

export default class Observable
{
    private observers: observer[] = [];
    constructor()
    {}
    addObserver(observer:observer)
    {
        this.observers.push(observer);
    }
    removeObserver(observer:observer)
    {
        const index = this.observers.indexOf(observer);
        if (index < 0)
        {
            return;
        }
        this.observers.splice(index, 1);
    }
    notify(...events:Event[])
    {
        for (const observer of this.observers)
        {
            for (const event of events)
            {
                observer(this, event);
            }
        }
    }
}