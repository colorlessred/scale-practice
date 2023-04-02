import {Utils} from "./Utils";

const A_REFERENCE = 220;
const SEMITONE = Math.pow(2, 1 / 12);

export class Note {
    // the value of the note. Can be beyond the 0-11 range, it doesn't matter
    private readonly _value: number;
    // note alterations. Flats if negative, Sharps if positive
    private readonly _alteration: number;

    /**
     * note in the 0-6 range
     */
    private readonly _baseNote: number;

    /**
     * octave
     */
    private readonly _octave: number;

    /**
     * absolute chromatic value. Can be any integer
     */
    private readonly _chromaticValue: number;

    private readonly _chromaticValueZeroOctave: number;

    private readonly _stringRepr: string;

    private readonly _frequency: number;

    private static readonly reFormat = /^([A-G])([b#]*)(\((\d+)\))?/;
    private static readonly charAValue = "A".charCodeAt(0);
    /**
     * values of the notes in the C Major scale
     */
    private static readonly C_MAJOR_VALUES = [0, 2, 4, 5, 7, 9, 11];
    private static SHARP = "#";
    private static FLAT = "b";

    constructor(value: number, alteration: number) {
        this._value = value;
        this._alteration = alteration;

        // compute secondary values that will never change
        this._baseNote = Utils.smartMod(this._value, 7);
        this._octave = Math.floor(this._value / 7);
        this._chromaticValue =
            Note.C_MAJOR_VALUES[this._baseNote]
            + 12 * this._octave
            + this._alteration;

        this._chromaticValueZeroOctave = Utils.smartMod(this._chromaticValue, 12);
        const letter = String.fromCharCode((this._baseNote + 2) % 7 + Note.charAValue);
        const alts = (this._alteration > 0) ? Note.SHARP.repeat(this._alteration) : Note.FLAT.repeat(-this._alteration);
        const octaveString = (this._octave !== 0) ? `(${this._octave})` : '';
        this._stringRepr = letter + alts + octaveString;

        // note A has value 9. So 9 + 3 - 12 = 0
        this._frequency = A_REFERENCE * Math.pow(SEMITONE, this.chromaticValue + 3 - 12);
    }

    /**
     * set custom symbols for the alterations.
     * Useful to make the tests work with the default ones, but using
     * better ones for the actual application
     * @param flat
     * @param sharp
     */
    static setAlterationSymbols(flat: string, sharp: string) {
        Note.FLAT = flat;
        Note.SHARP = sharp;
    }

    /**
     *
     * @returns The chromatic value. Can be any positive or negative integer
     */
    get chromaticValue(): number {
        return this._chromaticValue;
    }

    /**
     *
     * @returns the octave of the note
     */
    get octave(): number {
        return this._octave;
    }

    /**
     *
     * @returns Chromatic value in the zero octave. 0-11 integer
     */
    public getChromaticValueZeroOctave(): number {
        return this._chromaticValueZeroOctave;
    }

    get value() {
        return this._value;
    }

    get alteration() {
        return this._alteration;
    }

    /**
     * add two notes and their alterations
     * @param note
     * @returns
     */
    public add(note: Note): Note {
        return new Note(this._value + note._value, this._alteration + note._alteration);
    }

    /**
     *
     * @param numOctaves
     * @returns new note with the octaves added (or subtracted if numOctaves is negative)
     */
    public addOctaves(numOctaves: number) {
        return this.add(new Note(7 * numOctaves, 0));
    }


    // TODO test
    /**
     * return true if the note has same value and alteration
     * @param note
     */
    public equals(note: Note): boolean {
        return this._value === note._value && this._alteration === note._alteration;
    }

    /**
     *
     * @param note the note to be subtracted
     * @returns
     */
    public subtract(note: Note): Note {
        return new Note(this._value - note._value, this._alteration - note._alteration);
    }

    /**
     * add alterations to note to reach the desired target value
     * @param value the target chromatic value
     * @returns the altered note whose chromatic value equals the input
     */
    public alterToChromaticValue(value: number): Note {
        const correction = value - this.chromaticValue;
        return this.add(new Note(0, correction));
    }

    /**
     * Note(6, 0) => Note(-6, 1)
     * @returns the note that has the opposite chromatic value
     */
    public mirrorInterval(): Note {
        return new Note(-this.value, -this.alteration).alterToChromaticValue(-this.chromaticValue);
    }

    /**
     * NB: Note(6,0) is a major 7th up, but Note(-6, 0) is NOT a major 7th down because it's the
     * difference between C and D(-1), which is minor 7th down
     * @param note interval expressed as Note. The values will be added, brought back to the zero octave
     * @returns
     */
    public addInterval(note: Note): Note {
        const targetChromaticValue = this.chromaticValue + note.chromaticValue;
        return this.add(note).alterToChromaticValue(targetChromaticValue);
    }

    /**
     *
     * @param targetNote
     * @returns interval that added to this will give the target note
     */
    public computeIntervalToReach(targetNote: Note): Note {
        const chromaticDiff = targetNote.chromaticValue - this.chromaticValue;
        return targetNote.subtract(this).alterToChromaticValue(chromaticDiff);
    }

    /**
     * return new note whose chromatic value is in 0-11.
     * NB: this means that it could be in other octaves, e.g. Cb(1) has value of 11
     */
    public getNoteInChromaticBase(): Note {
        const deltaOctave = (this._chromaticValueZeroOctave - this._chromaticValue) / 12;
        return this.addOctaves(deltaOctave);
    }

    public toString(): string {
        return this._stringRepr;
    }

    public getFrequency(): number {
        return this._frequency;
    }

    public isHigherThan(note: Note): boolean {
        return this.chromaticValue > note.chromaticValue;
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
            const [noteName, noteAlts, octave] = [res[1], res[2], res[4]];
            let value = (noteName.charCodeAt(0) - Note.charAValue + 5) % 7;

            if (octave) {
                value += (parseInt(octave) * 7);
            }

            // we want C = 0 and B = 6
            // if the value is A, we get (0 + 5) % 7 = 5
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

const C_MAJOR_NOTES = [0, 1, 2, 3, 4, 5, 6].map(v => new Note(v, 0));
const INDEXES_WITH_SHARPS = [0, 1, 3, 4, 5];
const SHARP_NOTES = INDEXES_WITH_SHARPS.map(v => new Note(v, 1));
const FLAT_NOTES = INDEXES_WITH_SHARPS.map(v => new Note(v + 1, -1));
const ALL_NOTES_SHARP = [...C_MAJOR_NOTES, ...SHARP_NOTES].sort((a, b) => a.chromaticValue - b.chromaticValue);
const ALL_NOTES_FLAT = [...C_MAJOR_NOTES, ...FLAT_NOTES].sort((a, b) => a.chromaticValue - b.chromaticValue);
export const ALL_NOTES_FLAT_AND_SHARP = [...C_MAJOR_NOTES, ...SHARP_NOTES, ...FLAT_NOTES]
    .sort((a, b) => a.chromaticValue - b.chromaticValue);


