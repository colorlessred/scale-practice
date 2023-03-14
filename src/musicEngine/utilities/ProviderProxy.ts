import {IProvider} from "./IProvider";

/**
 * proxy that will intercept calls for the next note
 */
export class ProviderProxy<T> implements IProvider<T> {
    // TODO move to proper location
    private readonly noteProvider: IProvider<T>;
    private readonly afterNext: () => void;

    /**
     *
     * @param noteProvider the IProvider to wrap
     * @param afterNext the lambda to be called before returning the next note
     */
    constructor(noteProvider: IProvider<T>, afterNext: () => void) {
        this.noteProvider = noteProvider;
        this.afterNext = afterNext;
    }

    getNext(): T {
        const item: T = this.noteProvider.getNext();
        this.afterNext();
        return item;
    }

    reset(): void {
        throw Error("not yet implemented");
    }
}