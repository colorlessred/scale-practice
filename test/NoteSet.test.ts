import { expect } from 'chai';
import { Note } from "../src/musicEngine/Note";
import { NoteSet } from "../src/musicEngine/NoteSet";

describe(NoteSet.name, () => {
    describe('constructor', () => {
        it('C G', () => { expect(new NoteSet([new Note(0, 0), new Note(4, 0)], 'ns').toString()).eq('C G'); })
        it('C G(-1)', () => { expect(new NoteSet([new Note(0, 0), new Note(4 - 7, 0)], 'ns').toString()).eq('C G'); })
    });

    describe('parse and toString', () => {
        it('one note', () => { expect(NoteSet.parse("C").toString()).eq("C") });
        it('two notes', () => { expect(NoteSet.parse("C# Eb").toString()).eq("C# Eb") });
    });

    describe('fill abs values', () => {
        it('clash', () => { expect(() => { NoteSet.parse("C# Db") }).to.throw(Error, /position/) });

    });

    describe('steps', () => {
        // const stepToString = (step: number) => { return (step) ? step.toString() : '?'; }
        const stepsTest = (name: string, noteSetString: string, result: string) => {
            it(name, () => { expect(NoteSet.parse(noteSetString).getSteps().join('-')).to.eq(result) });
        }

        stepsTest('major', 'C D E F G A B', '2-2-1-2-2-2-1');
        stepsTest('underflow note', 'Cb D', '3-9');
        stepsTest('overflow note', 'A B#', '3-9');
    });

    it('getNotes', () => { expect(NoteSet.parse('C E G').getNotes().join('-')).eq('C-E-G') })

    describe('next notes', () => {
        it('next notes length', () => {
            expect(NoteSet
                .parse('C')
                .getNextNotes().getSize()
            ).to.eq(12);
        });
        it('major', () => {
            expect(NoteSet
                .parse('C D E F G A B')
                .getNextNotes()
                .join('-')
            ).to.eq('D-D-E-E-F-G-G-A-A-B-B-C(1)');
        });
        it('Cb E', () => {
            expect(NoteSet
                .parse('Cb E')
                .getNextNotes()
                .join('-')
            ).to.eq('E-E-E-E-Cb(1)-Cb(1)-Cb(1)-Cb(1)-Cb(1)-Cb(1)-Cb(1)-E(1)');
        });
    });

    describe('prev notes', () => {
        it('Cb E', () => {
            expect(NoteSet
                .parse('Cb E')
                .getPrevNotes()
                .join('-')
            ).to.eq('Cb-Cb-Cb-Cb-Cb-E-E-E-E-E-E-E');
        });
    });

    it('full name', () => { expect(NoteSet.parse('C E G', 'MajChord').getFullName()).eq('CMajChord') });

    describe('transpose', () => {
        it('major chord up 2nd', () => {
            expect(
                NoteSet.parse('C E G')
                    .transpose(new Note(1, 0))
                    .toString()
            ).eq('D F# A')
        });

        const ns = NoteSet.parse('C E G', 'MajChord').transpose(new Note(6, 0));
        it('major chord up maj 7th', () => { expect(ns.toString()).eq('B D# F#'); });
        it('has steps', () => { expect(ns.getSteps().join('-')).eq('4-3-5') })

        it('full name transposed', () => {
            expect(ns.getFullName()).eq('BMajChord');
        });

        it('C Major + 2min', () => {
            expect(NoteSet.Types.MAJOR.transpose(Note.parse('Db')).toString()).eq('Db Eb F Gb Ab Bb C');
        });
    });

    describe('get next note', () => {
        const ns = NoteSet.parse('C E G Bb');
        const testNote = (name: string, ns: NoteSet, note: Note, result: string) =>
            it(name, () => { expect(ns.getClosestNote(note, true).toString()).eq(result) });

        const testName = (name: string, ns: NoteSet, note: string, result: string) => testNote(name, ns, Note.parse(note), result);

        testName('Cb->C', ns, 'Cb', 'C');
        testName('C->E', ns, 'C', 'E');
        testName('E->G', ns, 'E', 'G');
        testName('G->Bb', ns, 'G', 'Bb');
        testName('Bb->C(1)', ns, 'Bb', 'C(1)');
        testNote('C(1)->E(1)', ns, new Note(7, 0), 'E(1)');
        testNote('E(1)->G(1)', ns, new Note(2 + 7, 0), 'G(1)');
        testNote('G(1)->Bb(1)', ns, new Note(4 + 7, 0), 'Bb(1)');
        testNote('Bb(1)->C(2)', ns, new Note(6 + 7, -1), 'C(2)');
        testNote('B(1)->C(2)', ns, new Note(6 + 7, 0), 'C(2)');
        testNote('Cb(2)->C(2)', ns, new Note(7 + 7, -1), 'C(2)');
    });

    describe('get prev note', () => {
        const ns = NoteSet.parse('C E G');
        const doTest = (name: string, ns: NoteSet, note: string, result: string) =>
            it(name, () => { expect(ns.getClosestNote(Note.parse(note), false).toString()).eq(result) });

        doTest('C->G(-1)', ns, 'C', 'G(-1)');
        doTest('E->C', ns, 'E', 'C');
        doTest('G->E', ns, 'G', 'E');
    });

    describe('getMode', () => {
        const ns = NoteSet.parse('C D E F G A B');
        it('mode 1', () => { expect(ns.getMode(1).toString()).eq('C D E F G A B') });
        it('mode 8', () => { expect(ns.getMode(8).toString()).eq('C D E F G A B') });
        it('mode 4', () => { expect(ns.getMode(4).toString()).eq('C D E F# G A B') });
        it('mode 5', () => { expect(ns.getMode(5).toString()).eq('C D E F G A Bb') });
        it('mode 7', () => { expect(ns.getMode(7).toString()).eq('C Db Eb F Gb Ab Bb') });
    });

    describe('minimizeAlterations', () => {
        function doTest(noteSet: NoteSet, transposeKey: string, betterKey: string) {
            it(`${transposeKey} should minimize as ${betterKey}`, () => {
                const ns = noteSet.transpose(Note.parse(transposeKey));
                const res = noteSet.transpose(Note.parse(betterKey));
                expect(ns.minimizeAlterations().toString()).eq(res.toString());
            });

        }

        function doTestMajor(transposeKey: string, betterKey: string) {
            doTest(NoteSet.Types.MAJOR, transposeKey, betterKey);
        }

        doTestMajor('E#', 'F');
        doTestMajor('D#', 'Eb');
        doTestMajor('G#', 'Ab');

        doTest(NoteSet.Types.MAJOR.getMode(2), 'Gb', 'F#');
    });

    describe('changeRoot', () => {
        it('D', () => {
            const ns = NoteSet.Types.MAJOR.changeRoot(Note.parse('D'));
            const res = NoteSet.Types.MAJOR.transpose(Note.parse('D'));
            expect(ns.toString()).eq(res.toString());
        })
        it('E#', () => {
            const ns = NoteSet.Types.MAJOR.changeRoot(Note.parse('E#'));
            const res = NoteSet.Types.MAJOR.transpose(Note.parse('E#'));
            expect(ns.toString()).eq(res.toString());
        })
        it('Db', () => {
            const ns = NoteSet.Types.MAJOR.changeRoot(Note.parse('Db'));
            const res = NoteSet.Types.MAJOR.transpose(Note.parse('Db'));
            expect(ns.toString()).eq(res.toString());
        })
        it('D -> Eb', () => {
            const ns = NoteSet.Types.MAJOR
                .transpose(Note.parse('D'));
            // D Major, transpose a minor second up
            const ns2 = ns.transpose(Note.parse('Db'));
            // Eb Major
            const res = ns.changeRoot(Note.parse('Eb'));
            expect(res.toString()).eq(ns2.toString());
        })
    });

    describe('getRoot', () => {
        function doTest(root: string, result: string = '') {
            result = (result === '') ? root : result;
            it(root, () => { expect(NoteSet.Types.MAJOR.transpose(Note.parse(root)).getRoot().toString()).eq(result); })
        }

        doTest('D##');
        doTest('Bb');
        doTest('E#');
        doTest('Fbb');
        doTest('B##', 'B##(-1)');
    });

    describe('contains', () => {
        const ns = NoteSet.parse('C E G');
        function doTest(noteValue: number, isContained: boolean) {
            const note = new Note(noteValue, 0);
            it(note.toString(), () => { expect(ns.contains(note)).eq(isContained); });
        }
        doTest(0, true);
        doTest(14, true);
        doTest(2, true);
        doTest(4, true);
        //
        doTest(5, false);
        doTest(3, false);
        doTest(1, false);
    });
});
