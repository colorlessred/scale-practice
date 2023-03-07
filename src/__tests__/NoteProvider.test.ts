import { expect } from 'chai';
import { Note } from "../musicEngine/Note";
import { NoteSet } from "../musicEngine/NoteSet";
import { NoteProvider } from "../musicEngine/NoteProvider";
import { NoteRange } from '../musicEngine/NoteRange';

describe(NoteProvider.name, () => {
    describe('basic scale up and down', () => {
        const np = new NoteProvider(Note.parse('C'), NoteSet.parse('C D E F G A B'),
            new NoteRange(Note.parse('C'), new Note(7, 0)), true);

        const testAndMove = (noteProducer: NoteProvider, noteString: string) => {
            it(noteString, () => { expect(noteProducer.getNext().toString()).eq(noteString) })
        };

        testAndMove(np, 'C');
        testAndMove(np, 'D');
        testAndMove(np, 'E');
        testAndMove(np, 'F');
        testAndMove(np, 'G');
        testAndMove(np, 'A');
        testAndMove(np, 'B');
        testAndMove(np, 'C(1)');
        testAndMove(np, 'B');
        testAndMove(np, 'A');
        testAndMove(np, 'G');
        testAndMove(np, 'F');
        testAndMove(np, 'E');
        testAndMove(np, 'D');
        testAndMove(np, 'C');
        testAndMove(np, 'D');
    });

    describe('Scale with change', () => {
        it('check scale', () => {
            const range = new NoteRange(new Note(0, 0), new Note(14, 0))
            const np = new NoteProvider(Note.parse('C'), NoteSet.parse('C E G'), range, true);

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
                const range = new NoteRange(new Note(0, 0), new Note(14, 0))
                const np = new NoteProvider(Note.parse('D'), NoteSet.parse('C E G'), range, goingUp);
                expect(np.getNext().toString()).eq(expected);
            });
        }
        doTest(true, 'E');
        doTest(false, 'C');
    })

});