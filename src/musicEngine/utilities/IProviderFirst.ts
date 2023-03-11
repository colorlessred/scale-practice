import {IProvider} from "./IProvider";

export interface IProviderFirst<T> extends IProvider<T> {

    /**
     * sets the first value. This is useful to chain various providers so that the next
     * returns values that follow the previous one
     * @param firstValue
     */
    setFirstValue(firstValue: T): void;

    /** get next element */
    getNext(): T;

    /**
     * reset provider
     * e.g. to restart a sequence from the head
     * */
    reset(): void;
}