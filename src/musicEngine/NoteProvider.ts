import {Note} from "./Note";
import {NoteRange} from "./NoteRange";
import {NoteSet} from "./NoteSet";
import {IProvider} from "./utilities/IProvider";

/**
 * encapsulate note and direction
 */
export class NoteAndDirection {
    readonly note: Note;
    /**
     * if true, direction is up, otherwise it is down
     */
    // TODO use enum instead of boolean
    readonly up: boolean;

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

    private noteAndDirection: NoteAndDirection;

    // private readonly firstNote: Note;
    private isFirst: boolean;

    private static readonly MAX_ATTEMPTS = 10;

    constructor(noteAndDirection: NoteAndDirection, noteSet: NoteSet, noteRange: NoteRange) {
        this.noteAndDirection = noteAndDirection;
        this.noteSet = noteSet;
        this.noteRange = noteRange;
        this.isFirst = true;
    }


    // TODO test
    /** reset provider to first note */
    public reset(): void {
        // TODO maybe use setFirstValue()?
        // this.currentNoteAndDirection = new NoteAndDirection(this.firstNote, this.currentNoteAndDirection.up);
    }

    public computeNextNoteAndDirection(): NoteAndDirection {
        let nextNoteAndDirection = new NoteAndDirection(this.noteSet.getClosestNote(this.noteAndDirection), this.noteAndDirection.up);

        if (!this.noteRange.contains(nextNoteAndDirection.note)) {
            // fix direction
            nextNoteAndDirection = new NoteAndDirection(this.noteAndDirection.note,
                this.noteRange.getMax().isHigherThan(nextNoteAndDirection.note));

            // it is possible that the range doesn't contain any note from the NoteSet, so
            // use a max number of attempts to avoid infinite loops and then throw an error
            for (let i = 0; i < NoteProvider.MAX_ATTEMPTS && (i === 0 || !this.noteRange.contains(nextNoteAndDirection.note)); i++) {
                nextNoteAndDirection = new NoteAndDirection(this.noteSet.getClosestNote(nextNoteAndDirection), nextNoteAndDirection.up);
            }
            if (!this.noteRange.contains(nextNoteAndDirection.note)) {
                throw new Error(`Cannot find note in range: ${this.noteRange.toString()}`);
            }
        }

        return nextNoteAndDirection;
    }

    /**
     * true if the note is in the NoteSet and in the NoteRange
     * @param note
     */
    public contains(note: Note) {
        return this.noteSet.contains(note) && this.noteRange.contains(note);
    }

    /**
     * return current note and then move to next
     * @returns next note
     */
    public getNext(): Note {
        if (this.isFirst) {
            this.isFirst = false;
            if (this.contains(this.noteAndDirection.note)) {
                return this.noteAndDirection.note;
            }
        }
        this.noteAndDirection = this.computeNextNoteAndDirection();
        return this.noteAndDirection.note;
    }

    public getDirectionUp(): boolean {
        return this.noteAndDirection.up;
    }

    public setNoteAndDirection(noteAndDirection: NoteAndDirection) {
        this.noteAndDirection = noteAndDirection;
    }

    public getNoteAndDirection(): NoteAndDirection {
        return this.noteAndDirection;
    }

    // TODO test fix cases
    public setNoteSet(noteSet: NoteSet) {
        this.noteSet = noteSet;
    }

    // TODO test fix cases
    public setNoteRange(noteRange: NoteRange) {
        this.noteRange = noteRange;
    }
}