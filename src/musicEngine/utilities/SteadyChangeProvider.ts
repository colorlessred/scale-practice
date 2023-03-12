import {IProvider} from "./IProvider";

/**
 * a provider of T, which generates then from a providers that change once every fixed number of elements T returned
 * U: the actual implementation of the IProvider<T>
 * T: the type returned by the provider
 */
export class SteadyChangeProvider<T> implements IProvider<T> {
    // readonly
    private readonly providerProvider: IProvider<IProvider<T>>;
    private readonly numElementsInGroup: number;

    // variables
    private countInGroup: number;
    private value: T;
    private provider:IProvider<T>;

    /**
     *
     * @param providerProvider the "provider of the provider"
     * @param numElementsInGroup the number of T elements after which it will get another Provider<T>
     * @param alignFunction function called with the previous and next IProvider<T> to let them align the values
     */
    constructor(providerProvider: IProvider<IProvider<T>>,
                numElementsInGroup: number) {
        if (numElementsInGroup < 1) {
            throw new Error('numElementsInGroup must be >= 0');
        }
        // read only
        this.providerProvider = providerProvider;
        this.numElementsInGroup = numElementsInGroup;
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