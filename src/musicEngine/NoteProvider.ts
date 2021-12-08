import { Note } from "./Note"
import { NoteRange } from "./NoteRange"
import { NoteSet } from "./NoteSet"


/** 
 * produce the sequence of notes in the given range, 
 * matching the underlying NoteSet
 */
export class NoteProvider {
    // TODO move to IProvider<Note>
    private note: Note;
    private noteSet: NoteSet;
    private noteRange: NoteRange;
    /** if true, it goes up to the next note */
    private directionUp: boolean;

    private static readonly MAX_ATTEMPTS = 10;

    constructor(currentNote: Note, noteSet: NoteSet, range: NoteRange, goingUp: boolean) {
        this.noteSet = noteSet;
        this.noteRange = range;
        this.note = currentNote;
        this.directionUp = goingUp;
    }

    public getNote() { return this.note; }

    public getNextNote(): Note {
        let nextNote = this.noteSet.getClosestNote(this.note, this.directionUp);

        if (!this.noteRange.contains(nextNote)) {
            // fix direction
            this.directionUp = this.noteRange.getMax().isHigherThan(nextNote);
            nextNote = this.note;

            // it is possible that the range doesn't contain any note from the NoteSet, so
            // use a max number of attempts to avoid infinite loops and then throw an error
            for (let i = 0; i < NoteProvider.MAX_ATTEMPTS && (i === 0 || !this.noteRange.contains(nextNote)); i++) {
                nextNote = this.noteSet.getClosestNote(nextNote, this.directionUp);
            }
            if (!this.noteRange.contains(nextNote)) {
                throw new Error(`Cannot find note in range: ${this.noteRange.toString()}`);
            }
        }

        // console.log(`next note is ${nextNote.toString()}`)

        return nextNote;
    }

    /**
     * move to next note and return its value
     * @returns next note
     */
    public moveToNextNote(): Note {
        const nextNote = this.getNextNote();
        this.setNote(nextNote);
        return nextNote;
    }

    public setNote(note: Note) { this.note = note; }
    public setNoteSet(noteSet: NoteSet) { this.noteSet = noteSet; }
    public setNoteRange(noteRange: NoteRange) { this.noteRange = noteRange; }
}