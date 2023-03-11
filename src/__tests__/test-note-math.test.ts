import {expect} from 'chai';
import {Note} from "../musicEngine/Note";
import {NoteRange} from "../musicEngine/NoteRange";
import {Utils} from "../musicEngine/Utils";

describe('Utils', () => {
    describe('smart module', () => {
        it('positive', () => {
            expect(Utils.smartMod(3, 7)).eq(3);
        });
        it('positive octave', () => {
            expect(Utils.smartMod(3 + 7, 7)).eq(3);
        });
        it('negative', () => {
            expect(Utils.smartMod(-3, 7)).eq(4);
        });
        it('negative octave', () => {
            expect(Utils.smartMod(-3 - 7, 7)).eq(4);
        });
    });
});

describe('NoteRange', () => {
    const contains = (noteRange: NoteRange, note: string, contains: boolean) => {
        it(note, () => {expect(noteRange.contains(Note.parse(note))).eq(contains)});
    }

    describe('normal creation', () => {
        const noteRange = new NoteRange(Note.parse('C'), Note.parse('G'));
        it('min', () => {
            expect(noteRange.getMin().toString()).eq('C');
        });
        it('max', () => {
            expect(noteRange.getMax().toString()).eq('G');
        });
    });

    describe('parse', () => {
        const noteRange = NoteRange.parse('C(0)-C(3)');
        contains(noteRange, 'C', true);
        contains(noteRange, 'C', true);
        contains(noteRange, 'C(3)', true);
        contains(noteRange, 'Db(3)', false);

    });

    it('invalid range', () => {
        expect(() => {
            new NoteRange(Note.parse('G'), Note.parse('C'));
        }).to.throw(Error, /cannot be below/);
    });
    describe('C-G contains', () => {
        const noteRange = new NoteRange(Note.parse('C'), Note.parse('G'));
        contains(noteRange, 'C', true);
        contains(noteRange, 'D', true);
        contains(noteRange, 'G', true);
        contains(noteRange, 'C(1)', false);
        contains(noteRange, 'G#', false);
        contains(noteRange, 'Cb', false);
    });
});

export {};

