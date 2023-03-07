import { IProvider } from "./IProvider";

/**
 * second order provider. after a fixed number of items per group it will get a different provider (e.g. a different NoteSet provider)
 * generics:
 * - S: what is returned by the first provider
 * - U: the actual type of the second provider
 * - T: the type to be returned
 * 
 */
export class SecondOrderProvider<S, U extends IProvider<T>, T> implements IProvider<T>{
    private readonly firstProvider: IProvider<S>
    private readonly itemsPerGroup: number;
    private readonly createInnerProvider: (a: S, b: U) => U;
    // 
    innerProvider: U;
    count: number;
    private currentS: S;

    /**
     * 
     * @param firstProvider higher level providers, e.g. NoteSet provider
     * @param itemsPerGroup how many items to extract from the second level provider
     * @param createInnerProvider function that takes an item from the first provider and the previous inner provider and returns the next inner provider
     */
    constructor(firstProvider: IProvider<S>, itemsPerGroup: number, createInnerProvider: (a: S, b: U) => U) {
        this.firstProvider = firstProvider;
        this.itemsPerGroup = itemsPerGroup;
        this.createInnerProvider = createInnerProvider
        // 
        this.currentS = this.firstProvider.getNext();
        this.innerProvider = this.getInnerProvider();
        this.count = 0;
    }

    private getInnerProvider(): U {
        return this.createInnerProvider(this.currentS, this.innerProvider);
    }

    /**
     * 
     * @returns the current value of the item returned by the first provider
     */
    getCurrentS(): S {
        return this.currentS;
    }

    /**
     * 
     * @returns next element
     */
    getNext(): T {
        if (this.count >= this.itemsPerGroup) {
            this.currentS = this.firstProvider.getNext();
            this.innerProvider = this.getInnerProvider();
            this.count = 0;
        }
        // console.log("second order provider, count: " + this.count);
        const out = this.innerProvider.getNext();
        this.count++;
        return out;
    }

    // TODO implement
    reset(): void {
        throw new Error("Method not implemented.");
    }
}