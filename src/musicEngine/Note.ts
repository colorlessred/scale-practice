import { Utils } from "./Utils";

const A_440 = 440;
const SEMITONE = Math.pow(2, 1 / 12);


export class Note {
    // the value of the note. Can be beyond the 0-11 range, it doesn't matter
    private readonly value: number;
    // note alterations. Flats if negative, Sharps if positive
    private readonly alteration: number;

    /**
     * note in the 0-6 range
     */
    private readonly baseNote: number;

    /**
     * octave
     */
    private readonly octave: number;

    /**
     * absolute chromatic value. Can be any integer
     */
    private readonly chromaticValue: number;

    private readonly chromaticValueZeroOctave: number;

    private readonly stringRepr: string;

    private readonly frequency: number;

    private static readonly reFormat = /^([A-G])([b#]*)/;
    private static readonly charAValue = "A".charCodeAt(0);
    /**
     * values of the notes in the C Major scale
     */
    private static readonly C_MAJOR_VALUES = [0, 2, 4, 5, 7, 9, 11];

    constructor(value: number, alteration: number) {
        this.value = value;
        this.alteration = alteration;

        // compute secondary values that will never change
        this.baseNote = Utils.smartMod(this.value, 7);
        this.octave = Math.floor(this.value / 7);
        this.chromaticValue =
            Note.C_MAJOR_VALUES[this.baseNote]
            + 12 * this.octave
            + this.alteration;

        this.chromaticValueZeroOctave = Utils.smartMod(this.chromaticValue, 12);

        const letter = String.fromCharCode((this.baseNote + 2) % 7 + Note.charAValue);
        const alts = (this.alteration > 0) ? "#".repeat(this.alteration) : "b".repeat(-this.alteration);
        const octaveString = (this.octave !== 0) ? `(${this.octave})` : '';
        this.stringRepr = letter + alts + octaveString;

        // note A has value 9. So 9 + 3 - 12 = 0
        this.frequency = A_440 * Math.pow(SEMITONE, this.getChromaticValue() + 3 - 12);
    }

    /**
     * 
     * @returns The chromatic value. Can be any positive or negative integer
     */
    public getChromaticValue(): number {
        return this.chromaticValue;
    }

    /**
     * 
     * @returns the octave of the note
     */
    public getOctave(): number {
        return this.octave;
    }

    /**
     * 
     * @returns Chromatic value in the zero octave. 0-11 integer
     */
    public getChromaticValueZeroOctave(): number {
        return this.chromaticValueZeroOctave;
    }

    public getValue() { return this.value; }
    public getAlteration() { return this.alteration; }

    /**
     * add two notes and their alterations
     * @param note 
     * @returns 
     */
    public add(note: Note): Note {
        return new Note(this.value + note.value, this.alteration + note.alteration);
    }

    /**
     * 
     * @param numOctaves 
     * @returns new note with the octaves added (or subtracted if numOctaves is negative)
     */
    public addOctaves(numOctaves: number) {
        return this.add(new Note(7 * numOctaves, 0));
    }

    /**
     * 
     * @param note the note to be subtracted
     * @returns 
     */
    public subtract(note: Note): Note {
        return new Note(this.value - note.value, this.alteration - note.alteration);
    }

    /**
     * 
     * @param note the transposition expressed as a Note. The values will be added, brought back to the zero octave
     * @returns 
     */
    public transpose(note: Note): Note {
        const out = this.add(note);
        const diatonicShift = out.getChromaticValue() - this.getChromaticValue();
        const intervalShift = note.getChromaticValue();
        const correction = intervalShift - diatonicShift;
        return out.add(new Note(0, correction));
    }

    /**
     * return new note whose chromatic value is in 0-11. 
     * NB: this means that it could be in other octaves, e.g. Cb(1) has value of 11
     */
    public getNoteInChromaticBase(): Note {
        const deltaOctave = (this.chromaticValueZeroOctave - this.chromaticValue) / 12;
        return this.addOctaves(deltaOctave);
    }

    public toString(): string {
        return this.stringRepr;
    }

    public getFrequency(): number {
        return this.frequency;
    }

    public isHigherThan(note: Note): boolean {
        return this.getChromaticValue() > note.getChromaticValue();
    }

    // ################ STATIC ################
    /**
     * 
     * @param note string to be parsed, e.g. C# or Gbb
     * @returns 
     */
    public static parse(note: string): Note {
        const res = Note.reFormat.exec(note);
        if (res) {
            const [noteName, noteAlts] = [res[1], res[2]];
            const value = (noteName.charCodeAt(0) - Note.charAValue + 5) % 7;
            // we want C = 0 and B = 6
            // if the value is A we get (0 + 5) % 7 = 5
            return new Note(value, Note.parseAlterations(noteAlts));
        } else {
            throw new Error(`Cannot parse Note '${note}'`);
        }
    }

    public static parseAlterations(alts: string): number {
        if (alts === null || alts.length === 0) {
            return 0;
        } else {
            const first = alts.charAt(0);
            const len = alts.length;

            if (first === 'b') {
                return -1 * len;
            } else if (first === '#') {
                return len;
            } else {
                throw new Error(`Cannot parse alterations '${alts}'`);
            }
        }
    }

    /**
     * 
     * @param value the chromatic value of the note to be created
     * @param withSharps if true it will use sharps. if false will use flats
     */
    public static fromChromaticValue(value: number, withSharps: boolean): Note {
        const notes = withSharps ? ALL_NOTES_SHARP : ALL_NOTES_FLAT;
        const baseIndex = Utils.smartMod(value, notes.length);
        const baseNote = notes[baseIndex];
        const octaveDelta = (value - baseIndex) / 12;
        return baseNote.addOctaves(octaveDelta);
    }

    public static readonly OCTAVE = new Note(7, 0);
}

// TODO move this logic to proper testable class
const C_MAJOR_NOTES = [0, 1, 2, 3, 4, 5, 6].map(v => new Note(v, 0));
const INDEXES_WITH_SHARPS = [0, 1, 3, 4, 5];
const SHARP_NOTES = INDEXES_WITH_SHARPS.map(v => new Note(v, 1));
const FLAT_NOTES = INDEXES_WITH_SHARPS.map(v => new Note(v + 1, -1));
const ALL_NOTES_SHARP = [...C_MAJOR_NOTES, ...SHARP_NOTES].sort((a, b) => a.getChromaticValue() - b.getChromaticValue());
const ALL_NOTES_FLAT = [...C_MAJOR_NOTES, ...FLAT_NOTES].sort((a, b) => a.getChromaticValue() - b.getChromaticValue());
export const ALL_NOTES_FLAT_AND_SHARP = [...C_MAJOR_NOTES, ...SHARP_NOTES, ...FLAT_NOTES]
    .sort((a, b) => a.getChromaticValue() - b.getChromaticValue());


