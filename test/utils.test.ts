
import { expect } from 'chai';
import { AutoQueue } from '../src/musicEngine/utilities/AutoQueue';
import { FixedProvider } from '../src/musicEngine/utilities/FixedProvider';
import { RandomProvider } from '../src/musicEngine/utilities/RandomProvider';
import { SmartArray } from '../src/musicEngine/utilities/SmartArray';
import { SmartIndex } from '../src/musicEngine/utilities/SmartIndex';

describe(SmartIndex.name, () => {
    const a: SmartArray<string> = SmartArray.fromArray(['a', 'b', 'c']);
    const si: SmartIndex<string> = a.getSmartIndex(0);

    it('first', () => { expect(si.getIndex()).eq(0); });
    it('first value', () => { expect(si.getValue()).eq('a'); });
    it('moveNextAndGetValue third', () => { expect(si.moveNextAndGetValue()).eq('b'); })
    it('getValue fourth, undefined', () => { expect(si.moveNextAndGetValue()).eq('c'); });
    it('value with offset, wrap positive', () => { expect(si.getValueWithOffset(2)).eq('b'); })
    it('value with offset, wrap negative', () => { expect(si.getValueWithOffset(-2)).eq('a'); })
});

describe(SmartArray.name, () => {
    const a: SmartArray<string> = SmartArray.fromArray(['a', 'b', 'c']);

    it('size', () => { expect(a.getSize()).eq(3); })
    it('get base', () => { expect(a.get(0)).eq('a'); })
    it('get wrap positive', () => { expect(a.get(5)).eq('c'); })
    it('get wrap negative', () => { expect(a.get(-2)).eq('b'); })

    const b = SmartArray.fromArray(['a', 'b', 'c', 'd']);
    it('loadFromArray', () => { expect(b.get(3)).eq('d'); })
    it('loadFromArray wrong size', () => {
        expect(() => { b.loadFromArray(['a']) }).throw(Error, /must have size/)
    });

    it('values', () => {
        expect(SmartArray.fromArray([1, 2, 3, 4]).getValues().join('-')).eq('1-2-3-4');
    });

});

describe('IProvider', () => {
    describe(FixedProvider.name, () => {
        const fixedProvider = new FixedProvider<number>([1, 2, 3, 4]);
        it('1', () => { expect(fixedProvider.getNext()).eq(1) });
        it('2', () => { expect(fixedProvider.getNext()).eq(2) });
        it('3', () => { expect(fixedProvider.getNext()).eq(3) });
        it('4', () => { expect(fixedProvider.getNext()).eq(4) });
        it('1', () => { expect(fixedProvider.getNext()).eq(1) });

        it('reset', () => {
            fixedProvider.reset();
            expect(fixedProvider.getNext()).eq(1);
        });

    });
});

describe(AutoQueue.name, () => {
    const autoQueue: AutoQueue<number> = new AutoQueue(3, new FixedProvider<number>([1, 2, 3]));

    it('init', () => { expect(`${autoQueue}`).eq('1 / 2 / 3') });
    it('dequeue', () => { expect(autoQueue.dequeue()).eq(1); });
    it('refill', () => { expect(`${autoQueue}`).eq('2 / 3 / 1'); });
    it('peek', () => { expect(autoQueue.peek(0)).eq(2) });
    it('peek', () => { expect(autoQueue.peek(1)).eq(3) });
});

describe(RandomProvider.name, () => {
    function check(randomSelector: RandomProvider<number>, expectedValue: boolean = false) {
        let itsBack: boolean = false;
        let oldValue: number = randomSelector.getNext();
        for (let i = 0; i < 1000 && !itsBack; i++) {
            const newValue = randomSelector.getNext();
            itsBack = (newValue === oldValue);
            oldValue = newValue;
        }

        expect(itsBack).eq(expectedValue);
    }

    it('does repeat, size 1', () => { check(new RandomProvider([1,]), true); });
    it('does not repeat, size 2', () => { check(new RandomProvider([1, 2])); });
    it('does not repeat, size 3', () => { check(new RandomProvider([1, 2, 3])); });
    it('does not repeat, size 4', () => { check(new RandomProvider([1, 2, 3, 4])); });
});