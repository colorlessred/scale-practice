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
    private readonly createInnerProvider: (a: S, previousProvider: U) => U;
    // 
    innerProvider: U;
    count: number;

    /**
     * 
     * @param firstProvider higher level providers, e.g. NoteSet provider
     * @param itemsPerGroup how many items to extract from the second level provider
     * @param createInnerProvider function that takes an item from the first provider and the previous inner provider and returns the next inner provider
     */
    constructor(firstProvider: IProvider<S>, itemsPerGroup: number, createInnerProvider: (a: S, prevInnerProvider: U) => U) {
        this.firstProvider = firstProvider;
        this.itemsPerGroup = itemsPerGroup;
        this.createInnerProvider = createInnerProvider
        // 
        this.innerProvider = this.getInnerProvider();
        this.count = 0;
    }

    private getInnerProvider(): U {
        let out = this.createInnerProvider(this.firstProvider.getNext(), this.innerProvider);
        return out;
    }

    /**
     * 
     * @returns next element
     */
    getNext(): T {
        if (this.count >= this.itemsPerGroup) {
            // console.log(`get next inner provider`);
            this.innerProvider = this.getInnerProvider();
            this.count = 0;
        }
        const out = this.innerProvider.getNext();
        this.count++;
        return out;
    }

    // TODO implement
    reset(): void {
        throw new Error("Method not implemented.");
    }
}