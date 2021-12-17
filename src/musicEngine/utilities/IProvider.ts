
export interface IProvider<T> {
    /** get next element */
    getNext(): T;

    /** 
     * reset provider 
     * e.g. to restart a sequence from the head
     * */
    reset(): void;
}