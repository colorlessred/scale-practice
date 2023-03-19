import {IProvider} from "./IProvider";

/**
 * proxy that will intercept calls for the next note
 */
export class ProviderProxy<T> implements IProvider<T> {
    private readonly noteProvider: IProvider<T>;
    /**
     * function to be executed before moving getting the next value.
     * useful to get the NoteSets before getting the next note that might trigger a change of NoteSet
     * @private
     */
    private readonly beforeNext: () => void;

    /**
     *
     * @param noteProvider the IProvider to wrap
     * @param beforeNext the lambda to be called before returning the next note
     */
    constructor(noteProvider: IProvider<T>, beforeNext: () => void) {
        this.noteProvider = noteProvider;
        this.beforeNext = beforeNext;
    }

    getNext(): T {
        this.beforeNext();
        return this.noteProvider.getNext();
    }

    reset(): void {
        throw Error("not yet implemented");
    }
}