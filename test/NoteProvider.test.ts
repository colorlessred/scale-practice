import { expect } from 'chai';
import { Note } from "../src/musicEngine/Note";
import { NoteSet } from "../src/musicEngine/NoteSet";
import { NoteProvider } from "../src/musicEngine/NoteProvider";
import { NoteRange } from '../src/musicEngine/NoteRange';

describe(NoteProvider.name, () => {
    describe('basic scale up and down', () => {
        const np = new NoteProvider(Note.parse('C'), NoteSet.parse('C D E F G A B'),
            new NoteRange(Note.parse('C'), new Note(7, 0)), true);

        const testAndMove = (noteProducer: NoteProvider, noteString: string) => {
            it(noteString, () => { expect(noteProducer.getNoteAndMoveToNext().toString()).eq(noteString) })
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

            const testAndMove = (noteProducer: NoteProvider, noteString: string) => {
                expect(noteProducer.getNoteAndMoveToNext().toString()).eq(noteString);
            };

            testAndMove(np, 'C');
            testAndMove(np, 'E');
            np.setNoteSet(NoteSet.parse('Bb D F'));
            testAndMove(np, 'G');
            testAndMove(np, 'Bb');
            testAndMove(np, 'D(1)');
            testAndMove(np, 'F(1)');
            testAndMove(np, 'Bb(1)');
            testAndMove(np, 'F(1)');
            np.setNoteSet(NoteSet.parse('C D E'));
            testAndMove(np, 'D(1)');
            testAndMove(np, 'C(1)');
            testAndMove(np, 'E');
            testAndMove(np, 'D');
        });
    });

});