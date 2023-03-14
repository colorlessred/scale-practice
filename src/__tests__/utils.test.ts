import {expect} from 'chai';
import {AutoQueue} from '../musicEngine/utilities/AutoQueue';
import {FixedProvider} from '../musicEngine/utilities/FixedProvider';
import {RandomProvider} from '../musicEngine/utilities/RandomProvider';
import {SmartArray} from '../musicEngine/utilities/SmartArray';
import {SmartIndex} from '../musicEngine/utilities/SmartIndex';
import {SteadyChangeProvider} from "../musicEngine/utilities/SteadyChangeProvider";
import {NoteSetTypes} from "../musicEngine/NoteSet";
import {Note} from "../musicEngine/Note";
import {NoteRange} from "../musicEngine/NoteRange";
import {NoteProviderProvider} from "../musicEngine/NoteProviderProvider";
import {NoteSetProviderFixed} from "../musicEngine/NoteSetProviders";
import {Direction, NoteAndDirection} from "../musicEngine/NoteProvider";
import {TestUtils} from "../musicEngine/utilities/TestUtils";

describe(SmartIndex.name, () => {
    const a: SmartArray<string> = SmartArray.fromArray(['a', 'b', 'c']);
    const si: SmartIndex<string> = a.getSmartIndex(0);

    it('first', () => {
        expect(si.getIndex()).eq(0);
    });
    it('first value', () => {
        expect(si.getValue()).eq('a');
    });
    it('moveNextAndGetValue third', () => {
        expect(si.moveNextAndGetValue()).eq('b');
    });
    it('getValue fourth, undefined', () => {
        expect(si.moveNextAndGetValue()).eq('c');
    });
    it('value with offset, wrap positive', () => {
        expect(si.getValueWithOffset(2)).eq('b');
    });
    it('value with offset, wrap negative', () => {
        expect(si.getValueWithOffset(-2)).eq('a');
    });
});

describe(SmartArray.name, () => {
    const a: SmartArray<string> = SmartArray.fromArray(['a', 'b', 'c']);

    it('size', () => {
        expect(a.getSize()).eq(3);
    });
    it('get base', () => {
        expect(a.get(0)).eq('a');
    });
    it('get wrap positive', () => {
        expect(a.get(5)).eq('c');
    });
    it('get wrap negative', () => {
        expect(a.get(-2)).eq('b');
    });

    const b = SmartArray.fromArray(['a', 'b', 'c', 'd']);
    it('loadFromArray', () => {
        expect(b.get(3)).eq('d');
    });
    it('loadFromArray wrong size', () => {
        expect(() => {
            b.loadFromArray(['a']);
        }).throw(Error, /must have size/);
    });

    it('values', () => {
        expect(SmartArray.fromArray([1, 2, 3, 4]).getValues().join('-')).eq('1-2-3-4');
    });

});

describe('IProvider', () => {
    describe(FixedProvider.name, () => {
        const fixedProvider = new FixedProvider<number>([1, 2, 3, 4]);
        it('restart from head', ()=>{
            expect(TestUtils.joinItemsFromProvider(fixedProvider, 5)).eq('1-2-3-4-1');
        });

        it('reset', () => {
            fixedProvider.reset();
            expect(fixedProvider.getNext()).eq(1);
        });
    });
});

describe(AutoQueue.name, () => {
    const autoQueue: AutoQueue<number> = new AutoQueue(3, new FixedProvider<number>([1, 2, 3]));

    it('init', () => {
        expect(`${autoQueue}`).eq('1-2-3');
    });
    it('peek', () => {
        expect(autoQueue.peek(0)).eq(1);
    });
    it('peek', () => {
        expect(autoQueue.peek(1)).eq(2);
    });
    it('getNext', () => {
        expect(autoQueue.getNext()).eq(1);
    });
    it('values after first pull', () => {
        expect(`${autoQueue}`).eq('2-3-1');
    });
});

describe(RandomProvider.name, () => {
    function check(randomSelector: RandomProvider<number>, expectedValue = false) {
        let itsBack = false;
        let oldValue: number = randomSelector.getNext();
        for (let i = 0; i < 1000 && !itsBack; i++) {
            const newValue = randomSelector.getNext();
            itsBack = (newValue === oldValue);
            oldValue = newValue;
        }

        expect(itsBack).eq(expectedValue);
    }

    it('does repeat, size 1', () => {
        check(new RandomProvider([1,]), true);
    });
    it('does not repeat, size 2', () => {
        check(new RandomProvider([1, 2]));
    });
    it('does not repeat, size 3', () => {
        check(new RandomProvider([1, 2, 3]));
    });
    it('does not repeat, size 4', () => {
        check(new RandomProvider([1, 2, 3, 4]));
    });
});

describe(SteadyChangeProvider.name, () => {
    it('changes every 4', () => {
        const range = NoteRange.parse('C(0)-C(3)');
        const ns1 = NoteSetTypes.MAJOR.changeRoot(Note.parse('C'));
        const ns2 = NoteSetTypes.MAJOR.changeRoot(Note.parse('C#'));
        const noteProviderProvider = new NoteProviderProvider(new NoteSetProviderFixed([ns1, ns2]), range, new NoteAndDirection(range.getMin(), Direction.UP));

        const steadyChangeProvider = new SteadyChangeProvider<Note>(noteProviderProvider, 4);

        expect(TestUtils.joinItemsFromProvider(steadyChangeProvider, 16)).eq('C-D-E-F-F#-G#-A#-B#-D(1)-E(1)-F(1)-G(1)-G#(1)-A#(1)-B#(1)-C#(2)');
    });

    it('changes every 4, changes direction', () => {
        const range = NoteRange.parse('C(0)-C(1)');
        const ns1 = NoteSetTypes.MAJOR.changeRoot(Note.parse('C'));
        const ns2 = NoteSetTypes.MAJOR.changeRoot(Note.parse('C#'));
        const noteProviderProvider = new NoteProviderProvider(new NoteSetProviderFixed([ns1, ns2]), range, new NoteAndDirection(range.getMin(), Direction.UP));

        const steadyChangeProvider = new SteadyChangeProvider<Note>(noteProviderProvider, 4);

        expect(TestUtils.joinItemsFromProvider(steadyChangeProvider, 21)).eq('C-D-E-F-F#-G#-A#-B#-B-A-G-F-D#-C#-B#(-1)-C#-D-E-F-G-G#');
    });
});

describe(NoteProviderProvider.name, () => {
    it('change when going down', () => {
        const range = NoteRange.parse('C(0)-C(1)');
        const ns1 = NoteSetTypes.MAJOR.changeRoot(Note.parse('C'));
        const ns2 = NoteSetTypes.MAJOR.changeRoot(Note.parse('C#'));
        const noteProviderProvider = new NoteProviderProvider(new NoteSetProviderFixed([ns1, ns2]), range, new NoteAndDirection(Note.parse('B'), Direction.UP));
        let noteProvider =  noteProviderProvider.getNext(); // C Scale
        expect(TestUtils.joinItemsFromProvider(noteProvider, 2)).eq('B-C(1)');
        noteProvider = noteProviderProvider.getNext(); // C# scale
        expect(TestUtils.joinItemsFromProvider(noteProvider, 2)).eq('A#-G#');
    });
});

