import {expect} from 'chai';
import {Note} from "../musicEngine/Note";
import {NoteSet, NoteSetTypes} from "../musicEngine/NoteSet";
import {NoteAndDirection, NoteProvider} from "../musicEngine/NoteProvider";
import {NoteRange} from '../musicEngine/NoteRange';

describe(NoteProvider.name, () => {

    it('basic scale up and down', () => {
        const noteRange = NoteRange.parse('C(0)-C(1)');

        const noteProvider = new NoteProvider(new NoteAndDirection(noteRange.getMin(), true), NoteSetTypes.MAJOR, noteRange);
        const notes = [...Array(16)].map(() => noteProvider.getNext().toString()).join('-');

        expect(notes).eq('C-D-E-F-G-A-B-C(1)-B-A-G-F-E-D-C-D');
    });

    describe('Scale with change', () => {
        it('check scale', () => {
            const range = new NoteRange(new Note(0, 0), new Note(14, 0));
            const np = new NoteProvider(new NoteAndDirection(Note.parse('C'), true), NoteSet.parse('C E G'), range);

            const doTest = (noteProvider: NoteProvider, noteString: string) => {
                expect(noteProvider.getNext().toString()).eq(noteString);
            };

            doTest(np, 'C');
            doTest(np, 'E');
            doTest(np, 'G');
            np.setNoteSet(NoteSet.parse('Bb D F'));
            doTest(np, 'Bb');
            doTest(np, 'D(1)');
            doTest(np, 'F(1)');
            doTest(np, 'Bb(1)');
            doTest(np, 'F(1)');
            np.setNoteSet(NoteSet.parse('C D E'));
            doTest(np, 'E(1)');
            doTest(np, 'D(1)');
            doTest(np, 'C(1)');
            doTest(np, 'E');
            doTest(np, 'D');
        });
    });

    describe('first note out of note set', () => {
        function doTest(goingUp: boolean, expected: string) {
            it(`going up? ${goingUp}`, () => {
                const range = new NoteRange(new Note(0, 0), new Note(14, 0));
                const np = new NoteProvider(new NoteAndDirection(Note.parse('D'), goingUp), NoteSet.parse('C E G'), range);
                expect(np.getNext().toString()).eq(expected);
            });
        }

        doTest(true, 'E');
        doTest(false, 'C');
    });

    describe('first note', () => {
        const noteSet = NoteSetTypes.MAJOR.changeRoot(Note.parse('C'));

        function doTest(range: string, first: string, expected: string, desc: string) {
            const noteRange = NoteRange.parse(range);
            const noteProvider = new NoteProvider(new NoteAndDirection(Note.parse(first), true), noteSet, noteRange);

            it(desc, () => {
                expect(noteProvider.getNext().toString()).eq(expected);
            });
        }

        doTest('C(0)-C(1)', 'C', 'C', 'first already in set');
        doTest('C(1)-C(2)', 'C', 'C(1)', 'go up to match range');
        doTest('C(1)-C(2)', 'Cb(1)', 'C(1)', 'go up from alteration to match range');
        doTest('C(1)-C(2)', 'C#(1)', 'D(1)', 'go up inside range');
        doTest('C(0)-C(1)', 'D(1)', 'C(1)', 'go down to match range');
    });
});