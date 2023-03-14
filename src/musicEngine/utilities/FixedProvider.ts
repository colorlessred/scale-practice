import { SmartArray } from "./SmartArray";
import { SmartIndex } from "./SmartIndex";
import { IProvider } from "./IProvider";

/**
 * cycle over a fixed set of elements
 */

export class FixedProvider<T> implements IProvider<T> {
    values: SmartArray<T>;
    index: SmartIndex<T>;
    /**
     * if in isReset = true, the method getNext() has not yet been called
     */
    isReset: boolean;

    constructor(values: T[]) {
        if (!values || values.length === 0) {
            throw new Error('NoteSet must contain some items');
        }

        this.values = SmartArray.fromArray(values);
        this.index = this.values.getSmartIndex(0);
        this.isReset = true;
    }

    /**
     *
     * @returns if first call return first value. Otherwise, move next and return value
     */
    getNext(): T {
        let out: T;
        if (this.isReset) {
            this.isReset = false;
            out = this.index.getValue();
        } else {
            out = this.index.moveNextAndGetValue();
        }

        return out;
    }

    reset() {
        this.isReset = true;
        this.index = this.values.getSmartIndex(0);
    }
}
