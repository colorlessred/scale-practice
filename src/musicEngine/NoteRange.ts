import { Note } from "./Note";

export class NoteRange {
    private min: Note;
    private max: Note;

    constructor(min: Note, max: Note) {
        this.min = min;
        if (max.getChromaticValue() < min.getChromaticValue()) {
            throw new Error(`max note ${max.toString()} cannot be below min note ${min.toString()}`);
        }
        this.max = max;
    }

    public getMin(): Note { return this.min; }
    public getMax(): Note { return this.max; }

    public contains(note: Note): boolean {
        const val = note.getChromaticValue();
        return val >= this.min.getChromaticValue() && val <= this.max.getChromaticValue();
    }

    public toString(): string { return `${this.min.toString()}-${this.max.toString()}` }
}