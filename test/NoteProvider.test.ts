import { expect } from 'chai';
import { Note } from "../src/musicEngine/Note";
import { NoteSet } from "../src/musicEngine/NoteSet";
import { NoteProvider } from "../src/musicEngine/NoteProvider";
import { NoteRange } from '../src/musicEngine/NoteRange';

describe(NoteProvider.name, () => {
    describe('basic scale up and down', () => {
        const np = new NoteProvider(Note.parse('C'), NoteSet.parse('C D E F G A B'),
            new NoteRange(Note.parse('C'), new Note(7, 0)), true);

        const moveAndTest = (noteProducer: NoteProvider, noteString: string) => {
            it(noteString, () => { expect(noteProducer.moveToNextNote().toString()).eq(noteString) })
        };

        expect(np.getNote().toString()).eq('C');
        moveAndTest(np, 'D');
        moveAndTest(np, 'E');
        moveAndTest(np, 'F');
        moveAndTest(np, 'G');
        moveAndTest(np, 'A');
        moveAndTest(np, 'B');
        moveAndTest(np, 'C(1)');
        moveAndTest(np, 'B');
        moveAndTest(np, 'A');
        moveAndTest(np, 'G');
        moveAndTest(np, 'F');
        moveAndTest(np, 'E');
        moveAndTest(np, 'D');
        moveAndTest(np, 'C');
        moveAndTest(np, 'D');
    });

    describe('Scale with change', () => {
        it('check scale', () => {
            const np = new NoteProvider(Note.parse('C'), NoteSet.parse('C E G'),
                new NoteRange(new Note(0, 0), new Note(14, 0)), true);

            const moveAndTest = (noteProducer: NoteProvider, noteString: string) => {
                expect(noteProducer.moveToNextNote().toString()).eq(noteString)
            };

            expect(np.getNote().toString()).eq('C');
            moveAndTest(np, 'E');
            moveAndTest(np, 'G');
            np.setNoteSet(NoteSet.parse('Bb D F'));
            moveAndTest(np, 'Bb');
            moveAndTest(np, 'D(1)');
            moveAndTest(np, 'F(1)');
            moveAndTest(np, 'Bb(1)');
            moveAndTest(np, 'F(1)');
            moveAndTest(np, 'D(1)');
            np.setNoteSet(NoteSet.parse('C D E'));
            moveAndTest(np, 'C(1)');
            moveAndTest(np, 'E');
            moveAndTest(np, 'D');
        });
    });

});