
export interface IProvider<T> {
    getNext(): T;

    /** 
     * reset provider 
     * e.g. to restart a sequence from the head
     * */
    reset(): void;
}