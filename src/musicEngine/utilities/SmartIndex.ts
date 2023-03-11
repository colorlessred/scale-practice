import {Utils} from "../Utils";
import {SmartArray} from "./SmartArray";

/**
 * wrap array in and index that can access items wrapping around the
 * array edges
 */
export class SmartIndex<T> {
    private readonly array: SmartArray<T>;
    private readonly length: number;
    private index = 0;

    /**
     *
     * @param array
     * @param initialValue
     */
    constructor(array: SmartArray<T>, initialValue = 0) {
        this.array = array;
        this.length = array.getSize();
        this.setIndex(initialValue);
    }

    private setIndex(value: number) {
        this.index = this.computeIndexValue(value);
    }

    private computeIndexValue(value: number) {
        return Utils.smartMod(value, this.length);
    }

    public getIndex() {
        return this.index;
    }

    public getValue(): T {
        return this.array.get(this.index);
    }

    public moveNextAndGetValue(): T {
        this.moveIndex(1);
        return this.getValue();
    }

    /**
     * @param value value to add
     * @returns new index value
     */
    public moveIndex(value: number): number {
        this.setIndex(this.index + value);
        return this.index;
    }

    /**
     * does NOT modify the current index position
     * @param offset value to add
     * @returns
     */
    public getIndexWithOffset(offset: number): number {
        return this.computeIndexValue(this.index + offset);
    }

    /**
     * does NOT modify the current index position
     * @param offset
     * @returns value at offset position
     */
    public getValueWithOffset(offset: number): T {
        return this.array.get(this.index + offset);
    }
}
