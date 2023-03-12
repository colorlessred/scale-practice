import {Note} from "./Note";
import {NoteRange} from "./NoteRange";
import {NoteSet} from "./NoteSet";
import {IProvider} from "./utilities/IProvider";

/**
 * encapsulate note and direction
 */
export class NoteAndDirection {
    note: Note;
    /**
     * if true, direction is up, otherwise it is down
     */
    up: boolean;

    constructor(note: Note, up: boolean) {
        this.note = note;
        this.up = up;
    }
}

/**
 * produce the sequence of notes in the given range,
 * matching the underlying NoteSet
 */
export class NoteProvider implements IProvider<Note> {

    private noteSet: NoteSet;
    private noteRange: NoteRange;
    // private currentNote: Note;

    private currentNoteAndDirection: NoteAndDirection;

    /** if true, it goes up to the next note */
        // private directionUp: boolean;
    private readonly firstNote: Note;
    private isFirst: boolean;

    private static readonly MAX_ATTEMPTS = 10;

    constructor(firstNote: Note, noteSet: NoteSet, range: NoteRange, goingUp: boolean) {
        this.firstNote = firstNote;
        this.noteSet = noteSet;
        this.noteRange = range;
        this.currentNoteAndDirection = new NoteAndDirection(firstNote, goingUp);
        // this.directionUp = goingUp;
        // this.currentNote = firstNote;
        this.isFirst = true;
        this.fixCurrentNote();
    }


    // TODO test
    /** reset provider to first note */
    public reset(): void {
        // TODO maybe use setFirstValue()?
        this.currentNoteAndDirection.note = this.firstNote;
    }

    public getCurrentNote() {
        return this.currentNoteAndDirection.note;
    }

    public computeNext(): NoteAndDirection {

        let nextNoteAndDirection = new NoteAndDirection(this.noteSet.getClosestNote(this.currentNoteAndDirection), true);

        if (!this.noteRange.contains(nextNoteAndDirection.note)) {
            // fix direction
            nextNoteAndDirection = new NoteAndDirection(this.currentNoteAndDirection.note, this.noteRange.getMax().isHigherThan(nextNoteAndDirection.note));

            // it is possible that the range doesn't contain any note from the NoteSet, so
            // use a max number of attempts to avoid infinite loops and then throw an error
            for (let i = 0; i < NoteProvider.MAX_ATTEMPTS && (i === 0 || !this.noteRange.contains(nextNote)); i++) {
                nextNote = this.noteSet.getClosestNote(nextNote, up);
            }
            if (!this.noteRange.contains(nextNote)) {
                throw new Error(`Cannot find note in range: ${this.noteRange.toString()}`);
            }
        }

        return new NoteProvider.NoteAndDirection(nextNote, up);
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

    /**
     * return current note and then move to next
     * @returns next note
     */
    public getNext(): Note {
        if (this.isFirst) {
            this.isFirst = false;
        } else {
            this.currentNote = this.computeNext();
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