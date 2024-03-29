import {IProvider} from "./IProvider";

const RECYCLE_FACTOR = 0.5;

/**
 * a Provider that randomly returns the values it was built with
 */
export class RandomProvider<T> implements IProvider<T> {
    private values: Array<T>;
    /** size of the recycle zone where the index can be reinserted */
    private readonly maxRecycleZoneSize: number;

    constructor(values: Array<T>) {
        if (!values || values.length === 0) {
            throw new Error('values array must contain some values');
        }
        // randomize the values provided
        this.values = RandomProvider.shuffle<T>(values);
        this.maxRecycleZoneSize = Math.ceil(this.values.length * RECYCLE_FACTOR);
    }

    public reset(): void {
        // nothing to do here, but it's needed for the IProvider interface
    }

    /**
     * tries to avoid close repetitions
     * @returns get next pseudo random value
     */
    public getNext(): T {
        // strategy: pick the first value and then reinserted it back towards the end of the array, so that
        // it won't show up too soon
        const value: T = this.values[0];
        const newIndex = this.values.length - Math.floor(Math.random() * this.maxRecycleZoneSize) - 1;
        // rebuild the values by reinserting the value in the recycle position
        // console.log(`maxRecycleZoneSize: ${this.maxRecycleZoneSize}, newIndex: ${newIndex}, values: ${this.values}`);
        this.values = [...this.values.slice(1, newIndex + 1), value, ...this.values.slice(newIndex + 1)];
        return value;
    }

    private static shuffle<T>(array: Array<T>): Array<T> {
        return array
            .map((value) => ({value, sort: Math.random()}))
            .sort((a, b) => a.sort - b.sort)
            .map(({value}) => value);
    }
}