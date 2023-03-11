import {Note} from "./Note";
import {NoteRange} from "./NoteRange";
import {NoteSet} from "./NoteSet";
import {IProvider} from "./utilities/IProvider";


/**
 * produce the sequence of notes in the given range,
 * matching the underlying NoteSet
 */
export class NoteProvider implements IProvider<Note> {
    private currentNote: Note;
    private noteSet: NoteSet;
    private noteRange: NoteRange;
    /** if true, it goes up to the next note */
    private directionUp: boolean;
    private readonly firstNote: Note;
    private isFirst: boolean;

    private static readonly MAX_ATTEMPTS = 10;

    constructor(firstNote: Note, noteSet: NoteSet, range: NoteRange, goingUp: boolean) {
        this.firstNote = firstNote;
        this.noteSet = noteSet;
        this.noteRange = range;
        this.directionUp = goingUp;
        this.currentNote = firstNote;
        this.isFirst = true;
        this.fixCurrentNote();
    }

    /**
     * if the first note passed is not in the note set, or out of range => move to the closest one
     * in the movement direction
     */
    private fixCurrentNote() {
        if (!this.noteSet.contains(this.currentNote) ||
            !this.noteRange.contains(this.currentNote)) {
            this.currentNote = this.computeNext();
            this.isFirst = true;
        }
    }

    // TODO test
    /** reset provider to first note */
    public reset(): void {
        // TODO maybe use setFirstValue()?
        this.currentNote = this.firstNote;
    }

    public getNote() {
        return this.currentNote;
    }

    public computeNext(): Note {
        let nextNote = this.noteSet.getClosestNote(this.currentNote, this.directionUp);

        if (!this.noteRange.contains(nextNote)) {
            // fix direction
            this.directionUp = this.noteRange.getMax().isHigherThan(nextNote);
            nextNote = this.currentNote;

            // it is possible that the range doesn't contain any note from the NoteSet, so
            // use a max number of attempts to avoid infinite loops and then throw an error
            for (let i = 0; i < NoteProvider.MAX_ATTEMPTS && (i === 0 || !this.noteRange.contains(nextNote)); i++) {
                nextNote = this.noteSet.getClosestNote(nextNote, this.directionUp);
            }
            if (!this.noteRange.contains(nextNote)) {
                throw new Error(`Cannot find note in range: ${this.noteRange.toString()}`);
            }
        }

        return nextNote;
    }

    /**
     * return current note and then move to next
     * @returns next note
     */
    public getNext(): Note {
        if (this.isFirst) {
            this.isFirst = false;
        } else {
            this.setFirstValue(this.computeNext());
        }
        return this.currentNote;
    }

    public getDirectionUp(): boolean {
        return this.directionUp;
    }

    public setDirectionUp(up: boolean) {
        this.directionUp = up;
    }

    // TODO test fix cases
    public setFirstValue(note: Note) {
        this.currentNote = note;
        this.fixCurrentNote();
    }

    // TODO test fix cases
    public setNoteSet(noteSet: NoteSet) {
        this.noteSet = noteSet;
        this.fixCurrentNote();
    }

    // TODO test fix cases
    public setNoteRange(noteRange: NoteRange) {
        this.noteRange = noteRange;
        this.fixCurrentNote();
    }
}