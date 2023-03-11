import {IProvider} from "./IProvider";

/**
 * a provider of T, which generates then from a providers that change once every fixed number of elements T returned
 */
export class Order2Provider<U extends IProvider<T>, T> implements IProvider<T> {
    // readonly
    private readonly providerProvider: IProvider<U>;
    private readonly numElementsInGroup: number;
    private readonly alignFunction: (prev: U, next: U) => void;

    // variables
    private provider: U;
    private countInGroup: number;
    private value: T;

    /**
     *
     * @param providerProvider the "provider of the provider"
     * @param numElementsInGroup the number of T elements after which it will get another Provider<T>
     * @param alignFunction function called with the previous and next IProvider<T> to let them align the values
     */
    constructor(providerProvider: IProvider<U>,
                numElementsInGroup: number,
                alignFunction: (prev: U, next: U) => void) {
        if (numElementsInGroup < 1) {
            throw new Error('numElementsInGroup must be >= 0');
        }
        // read only
        this.providerProvider = providerProvider;
        this.numElementsInGroup = numElementsInGroup;
        this.alignFunction = alignFunction;
        // variables
        // set it up already with the first values, so we also have access to the current value
        this.provider = providerProvider.getNext();
        this.countInGroup = 1;
        this.value = this.provider.getNext();
    }

    getNext(): T {
        const out = this.value;
        // move already to next
        if (this.countInGroup % this.numElementsInGroup == 0) {
            // we have already extracted all the elements we want
            this.countInGroup = 0;
            const nextProvider = this.providerProvider.getNext();
            this.alignFunction(this.provider, nextProvider);
            this.provider = nextProvider;
        }
        this.countInGroup++;
        this.value = this.provider.getNext();
        return out;
    }

    reset(): void {
        throw new Error("Method not implemented.");
    }
}