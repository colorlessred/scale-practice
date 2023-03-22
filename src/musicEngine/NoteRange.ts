import {Note} from "./Note";

export class NoteRange {
    private min: Note;
    private max: Note;

    constructor(min: Note, max: Note) {
        this.min = min;
        if (max.chromaticValue < min.chromaticValue) {
            throw new Error(`max note ${max.toString()} cannot be below min note ${min.toString()}`);
        }
        this.max = max;
    }

    public getMin(): Note {
        return this.min;
    }

    public getMax(): Note {
        return this.max;
    }

    public contains(note: Note): boolean {
        const val = note.chromaticValue;
        return val >= this.min.chromaticValue && val <= this.max.chromaticValue;
    }

    public toString(): string {
        return `${this.min.toString()}-${this.max.toString()}`;
    }

    static parse(range: string): NoteRange {
        const notes = range.split('-');
        if (notes.length != 2) {
            throw new Error("range strings must contain one and only one '-' symbol to separate min and max notes");
        }
        return new NoteRange(Note.parse(notes[0]), Note.parse(notes[1]));
    }
}