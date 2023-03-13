import {IProvider} from "./IProvider";

export interface IHasToString {
    toString(): string;
}

export class TestUtils {
    /**
     * get the first numItems from the provider and joins them. Very handy for the tests
     * @param provider
     * @param numItems
     */
    static joinItemsFromProvider<T extends IHasToString>(provider: IProvider<T>, numItems: number): string {
        return [...Array(numItems)].map(() => provider.getNext().toString()).join('-');
    }
}