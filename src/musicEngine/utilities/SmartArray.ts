import { Utils } from "../Utils";
import { SmartIndex } from "./SmartIndex";

/**
 * an array whose get and set methods wrap around, so the indexes are accessed
 * modulo the array length
 */
export class SmartArray<T>{
    private readonly arr: Array<T>;
    private readonly size: number;

    constructor(size: number) {
        if (size < 1) {
            throw new Error(`specified length ${size} is not valid. must be >= 0`);
        }
        this.size = size;
        this.arr = new Array<T>(size);
    }

    public modIndex(index: number) {
        return Utils.smartMod(index, this.size);
    }

    public set(index: number, value: T) {
        this.arr[this.modIndex(index)] = value;
    }

    public get(index: number): T {
        return this.arr[this.modIndex(index)];
    }

    public getSize(): number {
        return this.size;
    }

    public loadFromArray(array: Array<T>) {
        if (!array || array.length !== this.size) {
            throw new Error(`array to load from must have size ${this.size} but has size ${array.length}`);
        }
        array.forEach((v, i) => this.set(i, v));
    }

    public map<S>(f: (value: T) => S): Array<S> {
        return this.arr.map(f);
    }

    public join(separator: string): string {
        return this.arr.join(separator);
    }

    public forEach(f: (value: T, index: number) => void) {
        this.arr.forEach(f);
    }

    public getValues(): Array<T> {
        return this.arr.slice();
    }

    /**
     * @param array 
     * @returns SmartArray with the values copied from array
     */
    public static fromArray<T>(array: Array<T>): SmartArray<T> {
        if (!array || array.length === 0) {
            throw new Error(`cannot init from empty arrray`);
        }
        const out: SmartArray<T> = new SmartArray<T>(array.length);
        array.forEach((v, i) => out.set(i, v));
        return out;
    }

    // not sure this is a good idea, since now SmartIndex and SmartArray depend on each other
    public getSmartIndex(initValue: number = 0): SmartIndex<T> {
        return new SmartIndex<T>(this, initValue);
    }

}