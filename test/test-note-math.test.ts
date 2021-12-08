import { expect } from 'chai';
import { Note } from "../src/musicEngine/Note";
import { NoteRange } from "../src/musicEngine/NoteRange";
import { Utils } from "../src/musicEngine/Utils";

describe('Utils', () => {
    describe('smart module', () => {
        it('positive', () => { expect(Utils.smartMod(3, 7)).eq(3); })
        it('positive octave', () => { expect(Utils.smartMod(3 + 7, 7)).eq(3); })
        it('negative', () => { expect(Utils.smartMod(-3, 7)).eq(4); })
        it('negative octave', () => { expect(Utils.smartMod(-3 - 7, 7)).eq(4); })
    })
})

describe('NoteRange', () => {

    describe('normal creation', () => {
        const noteRange = new NoteRange(Note.parse('C'), Note.parse('G'));
        it('min', () => { expect(noteRange.getMin().toString()).eq('C'); });
        it('max', () => { expect(noteRange.getMax().toString()).eq('G'); });
    });
    it('invalid range', () => {
        expect(() => { new NoteRange(Note.parse('G'), Note.parse('C')) }).to.throw(Error, /cannot be below/);
    });
    describe('C-G contains', () => {
        const noteRange = new NoteRange(Note.parse('C'), Note.parse('G'));
        it('C', () => { expect(noteRange.contains(Note.parse('C'))).eq(true); })
        it('D', () => { expect(noteRange.contains(Note.parse('D'))).eq(true); })
        it('G', () => { expect(noteRange.contains(Note.parse('G'))).eq(true); })
        it('C(1)', () => { expect(noteRange.contains(new Note(7, 0))).eq(false); })
        it('G#', () => { expect(noteRange.contains(Note.parse('G#'))).eq(false); })
        it('Cb', () => { expect(noteRange.contains(Note.parse('Cb'))).eq(false); })
    });
});

export { };

