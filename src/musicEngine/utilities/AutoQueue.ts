import {IProvider} from "./IProvider";

/**
 * fixed length queue that has its own provider that refills it automatically
 */
export class AutoQueue<T> {
    // TODO ? implement IProvider<T>?
    readonly size: number;
    values: Array<T>;
    provider: IProvider<T>;
    readonly beforeGetNext: () => void;

    /**
     * @param size queue size
     * @param provider provider that automatically refills the queue
     * @param beforeGetNext function called before generating the next value
     */
    constructor(size: number, provider: IProvider<T>, beforeGetNext: () => void = () => { /* */ }) {
        if (size < 2) {
            throw new Error(`size must be at least 2. Received ${size}`);
        }
        this.size = size;

        this.provider = provider;

        this.beforeGetNext = beforeGetNext;

        this.values = new Array<T>();
        // init the values using the provider
        for (let i = 0; i < this.size; i++) {
            this.values.push(this.getNext());
        }
    }

    /**
     *
     * @returns next value, applying the proper hooks
     */
    private getNext(): T {

        this.beforeGetNext();

        const provNext = this.provider.getNext();
        if (!provNext) {
            throw new Error(`empty value from provider`);
        }

        // const hookNext = this.filterNextHook(provNext);
        // if (!provNext) {
        //     throw new Error(`empty value from filterNextHook`);
        // }

        return provNext;
    }

    /**
     *
     * @returns clone with the same values
     */
    public clone(): AutoQueue<T> {
        const out = new AutoQueue<T>(this.size, this.provider, this.beforeGetNext);
        out.values = this.values.slice();
        return out;
    }

    /**
     * remove element from the queue and return it
     * this will trigger a refill from the end of the queue
     */
    public dequeue(): T {
        // refill from provider
        this.values.push(this.getNext());
        const out: T | undefined = this.values.shift();

        if (out === undefined) {
            throw new Error('undefined value in the queue');
        }
        return out;
    }

    /**
     *
     * @param index index in the queue. 0 is the first in the queue
     * @returns the value at the specified index
     */
    public peek(index: number): T {
        if (index < 0 || index > this.values.length) {
            throw new Error(`invalid index ${index}. Must be between 0 and ${this.values.length} `);
        }

        const out = this.values[index];
        if (out === undefined) {
            throw new Error(`Undefined value in queue. Position ${index}`);
        }

        return out;
    }

    public toString(): string {
        return this.values.map(value => `${value}`).join(' / ');
    }

    public getProvider(): IProvider<T> {
        return this.provider;
    }

    public setProvider(provider: IProvider<T>) {
        this.provider = provider;
    }
}