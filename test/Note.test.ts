import { expect } from 'chai';
import { Note } from "../src/musicEngine/Note";

describe(Note.name, function () {
    it('add', function () {
        const result = new Note(1, 1).add(new Note(3, -1));
        expect(result.getValue()).to.eq(4);
        expect(result.getAlteration()).to.eq(0);
    });


    it('subtract', () => {
        const result = new Note(4, 1).subtract(new Note(1, 2));
        expect(result.getValue()).eq(3);
        expect(result.getAlteration()).eq(-1);
    });

    it('negative note', () => { expect(new Note(-1 - 7 * 10, 0).toString()).eq('B(-11)') });

    describe('Parse', () => {
        it('wrong format', function () {
            expect(() => { Note.parse("123") }).to.throw(Error, /Cannot parse/);
        });

        it('alterations', () => {
            expect(Note.parseAlterations('b')).eq(-1);
            expect(Note.parseAlterations('#')).eq(1);
            expect(Note.parseAlterations('##')).eq(2);
            expect(Note.parseAlterations('bb')).eq(-2);
            expect(Note.parseAlterations('#b')).eq(2);
            expect(() => { Note.parseAlterations('qqq') }).to.throw(Error, /Cannot parse alterations/)
        });

        it('single flat', function () {
            let note = Note.parse('Ab');
            expect(note.getValue(), 'value').eq(5);
            expect(note.getAlteration(), 'alteration').eq(-1);
        });

        it('double flat', function () {
            let note = Note.parse('Cbb');
            expect(note.getValue(), 'value').eq(0);
            expect(note.getAlteration(), 'alteration').eq(-2);
        });

        it('double sharp', function () {
            let note = Note.parse('B##');
            expect(note.getValue(), 'value').eq(6);
            expect(note.getAlteration(), 'alteration').eq(2);
        });

    });

    describe('to string', () => {
        it('simple C', () => { expect(new Note(0, 0).toString()).eq("C"); });
        it('C#', () => { expect(new Note(0, 1).toString()).eq("C#"); });
        it('B', () => { expect(new Note(6, 0).toString()).eq("B"); });
        it('Bbb', () => { expect(new Note(6, -2).toString()).eq("Bbb"); });
        it('Bbb(1)', () => { expect(new Note(6 + 7, -2).toString()).eq("Bbb(1)"); });
        it('Bbb(-1)', () => { expect(new Note(6 - 7, -2).toString()).eq("Bbb(-1)"); });
    });

    describe('reset octave', () => {
        it('Bbb(-1)', () => { expect(new Note(6 - 7, -2).getNoteInChromaticBase().toString()).eq("Bbb"); });
        it('Bbb(+1)', () => { expect(new Note(6 + 7, -2).getNoteInChromaticBase().toString()).eq("Bbb"); });
        it('Cb(1)', () => { expect(new Note(7, -1).getNoteInChromaticBase().toString()).eq("Cb(1)"); });
    });

    describe('chromatic value', () => {
        it('C', () => { expect(new Note(0, 0).getChromaticValue()).eq(0); });
        it('C#', () => { expect(new Note(0, 1).getChromaticValue()).eq(1); });
        it('C##', () => { expect(new Note(0, 2).getChromaticValue()).eq(2); });
        it('D', () => { expect(new Note(1, 0).getChromaticValue()).eq(2); });
        it('Cb', () => { expect(new Note(0, -1).getChromaticValue()).eq(-1); });
        it('B#', () => { expect(new Note(6, 1).getChromaticValue()).eq(12); });
        it('Bb(1)', () => { expect(new Note(6 + 7, -1).getChromaticValue()).eq(11 + 12 - 1); });
        it('B#(1)', () => { expect(new Note(6 + 7, 1).getChromaticValue()).eq(11 + 12 + 1); });
    })

    describe('chromatic base value', () => {
        it('Cb', () => { expect(new Note(0, -1).getChromaticValueZeroOctave()).eq(11); });
        it('B#', () => { expect(new Note(6, 1).getChromaticValueZeroOctave()).eq(0); });
    })

    describe('addInterval', () => {
        it('C + maj 2nd', () => { expect(Note.parse('C').addInterval(new Note(1, 0)).toString()).eq('D'); })
        it('E + maj 2nd', () => { expect(Note.parse('E').addInterval(new Note(1, 0)).toString()).eq('F#'); })
        it('Bb + octave', () => { expect(Note.parse('Bb').addInterval(new Note(7, 0)).toString()).eq('Bb(1)'); })
        it('F - perfect 5th', () => { expect(Note.parse('F').addInterval(new Note(-4, 0)).toString()).eq('Bb(-1)'); })
        it('C + maj 7th down', () => { expect(Note.parse('C').addInterval(new Note(-6, 0)).toString()).eq('D(-1)'); });

        // this not intuitive. Note(6, 0) is a major 7th up. Note(-6, 0) is a minor 7th down 
        it('C + Note(6,0) + Note(-6,0)', () => {
            expect(Note.parse('C')
                .addInterval(new Note(6, 0))
                .addInterval(new Note(-6, 0))
                .toString()).eq('C#');
        });
    });

    describe('getOctave', () => {
        it('G(0)', () => { expect(new Note(4, 0).getOctave()).eq(0); })
        it('G(1)', () => { expect(new Note(4 + 7, 0).getOctave()).eq(1); })
        it('Cb(0)', () => { expect(new Note(0, -1).getOctave()).eq(0); })
        it('B#(1)', () => { expect(new Note(6 + 7, 1).getOctave()).eq(1); })
    });

    describe('addOctave', () => {
        it('G(0) + 1', () => { expect(new Note(4, 0).addOctaves(1).toString()).eq('G(1)'); })
        it('Cb(1) - 1', () => { expect(new Note(7, -1).addOctaves(-1).toString()).eq('Cb'); })
    });

    describe('isHigher', () => {
        it('higher', () => { expect(Note.parse('B').isHigherThan(Note.parse('G'))).eq(true) });
        it('same', () => { expect(Note.parse('A#').isHigherThan(Note.parse('Bb'))).eq(false) });
        it('lower', () => { expect(Note.parse('Fbb').isHigherThan(Note.parse('E'))).eq(false) });
    });

    describe('fromChromaticValue', () => {
        function test(note: Note) {
            const withSharps = (note.getAlteration() >= 0);
            const chromaticValue = note.getChromaticValue();
            const name = note.toString();
            it(name, () => { expect(Note.fromChromaticValue(chromaticValue, withSharps).toString()).eq(name) })
        }

        test(new Note(0, 0));
        test(new Note(0, 1));
        test(new Note(1, 0));
        test(new Note(1, 1));
        test(new Note(1, -1));
        test(new Note(3, 0));
        test(new Note(7, 0));
        test(new Note(-7, 0));
        test(new Note(7 + 4, 1));
    });

    describe('mirrorInterval', () => {
        function testMirror(note: Note) {
            it(`mirror ${note}`, () => { expect(note.getChromaticValue() + note.mirrorInterval().getChromaticValue()).eq(0) });
        }

        testMirror(Note.parse('C'));
        testMirror(Note.parse('B'));
        testMirror(Note.parse('F'));
        testMirror(Note.parse('Gb'));
        testMirror(Note.parse('A#'));
        testMirror(new Note(7, 1));
        testMirror(new Note(-1, 3));
    })

    describe('alterToChromaticValue', () => {
        it('C to 3', () => { expect(Note.parse('C').alterToChromaticValue(3).toString()).eq('C###') });
        it('B to 12', () => { expect(Note.parse('B').alterToChromaticValue(12).toString()).eq('B#') });
        it('D(1) to 12', () => { expect(new Note(1 + 7, 0).alterToChromaticValue(12).toString()).eq('Dbb(1)') });
    });

});