import { Note } from "./Note";
import { Utils } from "./Utils";
import { SmartArray } from "./utilities/SmartArray";

/**
 * represents a set of notes where their octave has not importance, like a scale or a chord
 */
export class NoteSet {
    /**
     * notes in the contained in the Set. They are reset to the zero octave, but they keep their adding order
     */
    private readonly notes: SmartArray<Note>;

    /**
     * human readable name of the note set
     */
    private readonly name: string = '';

    /**
     * array that maps the 12 possible base values to the Notes
     */
    private readonly valuesToNotes: SmartArray<Note> = new SmartArray<Note>(12);

    /**
     * steps the between the notes, starting from notes[0]
     */
    private readonly steps: SmartArray<number>;

    /**
     * for any chromatic note in the zero octave, point to the next/prev note
     */
    private readonly nextNotes: SmartArray<Note> = new SmartArray<Note>(12);
    private readonly prevNotes: SmartArray<Note> = new SmartArray<Note>(12);

    private constructor(notes: Note[], name: string) {
        this.notes = SmartArray.fromArray(notes);
        this.name = name;
        this.steps = new SmartArray<number>(notes.length);
        this.computeValuesToNotes()
        this.computeSteps();
        this.computePrevAndNextNotes();
    }

    private computeValuesToNotes() {
        const arr: Note[] = new Array<Note>(12);
        this.notes.forEach((note) => {
            const arrIndex = note.getChromaticValueZeroOctave();
            const currentNote = arr[arrIndex];
            if (currentNote) {
                throw new Error(`note for position ${arrIndex} already taken. Cannot insert note ${note.toString()}`);
            }
            arr[arrIndex] = note;
        });
        this.valuesToNotes.loadFromArray(arr);
    }

    /**
    * 
    * @returns the steps between the notes
    */
    private computeSteps() {
        const newSteps: number[] = [];
        const root = this.notes.get(0);
        const chromaticIndex = this.valuesToNotes.getSmartIndex(root.getChromaticValueZeroOctave());
        let prev = chromaticIndex.getIndex();

        for (let i = 0; i < 12; i++) {
            chromaticIndex.moveIndex(1);
            if (chromaticIndex.getValue() !== undefined) {
                // there is a note
                newSteps.push(Utils.smartMod(chromaticIndex.getIndex() - prev, 12));
                prev = chromaticIndex.getIndex();
            }
        }

        this.steps.loadFromArray(newSteps);
    }

    private setClosestNote(index: number, note: Note, next: boolean) {
        const [notesArray, octave] = next ? [this.nextNotes, 1] : [this.prevNotes, -1];
        const noteWithOctave = (octave * note.getChromaticValueZeroOctave() > octave * index) ? note : note.addOctaves(octave);
        notesArray.set(index, noteWithOctave);
    }

    private computePrevAndNextNotes() {
        const firstNote = this.notes.get(0);
        const chromaticIndex = this.valuesToNotes.getSmartIndex(firstNote.getChromaticValueZeroOctave());
        const stepsIndex = this.steps.getSmartIndex();

        for (let j = 0; j < this.steps.getSize(); j++) {
            // here we have a note.
            const currentNote = chromaticIndex.getValue();

            const nextStep = stepsIndex.getValue();
            const prevStep = stepsIndex.getValueWithOffset(-1);

            const nextNote = chromaticIndex.getValueWithOffset(nextStep);
            const prevNote = chromaticIndex.getValueWithOffset(-prevStep);

            this.setClosestNote(chromaticIndex.getIndex(), nextNote, true);
            this.setClosestNote(chromaticIndex.getIndex(), prevNote, false);

            // go over the chromatic values without notes and set prev and next notes
            for (let i = 1; i < nextStep; i++) {
                const newValue = chromaticIndex.moveIndex(1);

                this.setClosestNote(newValue, nextNote, true);
                this.setClosestNote(newValue, currentNote, false);
            }
            chromaticIndex.moveIndex(1);
            stepsIndex.moveIndex(1);
        };
    }

    public getNextNotes() { return this.nextNotes; }
    public getPrevNotes() { return this.prevNotes; }

    public getNoteFromChromaticValue(chromaticValue: number): Note | undefined {
        return this.valuesToNotes.get(chromaticValue);
    }

    /**
     * return the steps between the note set notes, starting from the first note added (not from the lowest)
     * e.g. 2-2-1-2-2-2 for the major scale
     */
    public getSteps(): SmartArray<number> {
        return this.steps;
    }

    /**
     * 
     * @returns shallow copy of the array with the underlying notes
     */
    public getNotes(): Array<Note> {
        return this.notes.getValues();
    }

    /**
     * create new NoteSet by adding passed note to the NoteSet ones
     * @param note new NoteSet translated
     */
    public transpose(note: Note): NoteSet {
        const newNotes = this.notes.map(nsNote => nsNote.transpose(note).getNoteInChromaticBase())

        return new NoteSet(newNotes, this.name);
    }

    /**
     * 
     * @returns string representation, using the same order of the notes as parsed
     */
    public toString(): string {
        const buff: string[] = [];
        this.notes.forEach((note) => {
            buff.push(`${note}`);
        });
        return buff.join(' ');
    }

    /**
     * 
     * @param note starting note
     * @param next if true return next note, otherwise return previous note
     * @returns closest (next/previous) note
     */
    public getClosestNote(note: Note, next: boolean): Note {
        const notesArray = next ? this.nextNotes : this.prevNotes;

        // move note to 0-11 chromatic range to figure out next note and then
        // bring it back to the original octave

        // get note in the 0-11 chromatic range. this might not have octave = 0, e.g. for Cb(1)
        const noteInChromaticBase = note.getNoteInChromaticBase();
        // see how far that is from the input note
        const octaveDelta = note.subtract(noteInChromaticBase);
        // get the next note, which might go to octaves 1 or -1
        const nextZeroOctave: Note = notesArray.get(noteInChromaticBase.getChromaticValue());
        // add back the initial delta
        return nextZeroOctave.add(octaveDelta);
    }

    /**
     * 
     * @returns then name, e.g. "Major"
     */
    public getName(): string { return this.name; }

    /**
     * 
     * @returns full name with root and note set "type" (e.g. Maj)
     */
    public getFullName(): string {
        const rootName = this.notes.get(0).toString();
        return `${rootName}${this.name}`;
    }

    public static parse(str: string, name: string = ''): NoteSet {
        const notes: Note[] = [];

        str.split(/\s+/).forEach((item: string) => {
            if (item !== '') {
                notes.push(Note.parse(item));
            }
        });

        return new NoteSet(notes, name);
    }
}

export namespace NoteSet {
    export class Types {
        static readonly MAJOR: NoteSet = NoteSet.parse("C D E F G A B", 'Major');
        static readonly MELODIC_MINOR: NoteSet = NoteSet.parse("C D Eb F G A B", 'Melodic Minor');
    }
}