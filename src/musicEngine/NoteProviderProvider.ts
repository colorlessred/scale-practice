import {Direction, NoteAndDirection, NoteProvider} from "./NoteProvider";
import {IProvider} from "./utilities/IProvider";
import {NoteRange} from "./NoteRange";
import {INoteSetProvider} from "./NoteSetProviders";

/**
 * given a provider of NoteSets it creates a provider of NoteProvider by creating and chaining the appropriate NoteProviders
 */
export class NoteProviderProvider implements IProvider<NoteProvider> {
    private readonly noteSetProvider: INoteSetProvider;
    private readonly noteRange: NoteRange;

    // variables
    private currentNoteProvider: NoteProvider;

    constructor(noteSetProvider: INoteSetProvider, noteRange: NoteRange) {
        this.noteSetProvider = noteSetProvider;
        this.noteRange = noteRange;

        // create the first NoteProvider, default to the lowest note in the range and going up direction
        this.currentNoteProvider = new NoteProvider(new NoteAndDirection(noteRange.getMin(), Direction.UP), noteSetProvider.getNext(), noteRange);
    }

    getNext(): NoteProvider {
        const nextNoteSet = this.noteSetProvider.getNext();

        // init the next NoteProvider, starting the current note
        return new NoteProvider(
            this.currentNoteProvider.getNoteAndDirection(),
            nextNoteSet, this.noteRange
        );
    }

    reset(): void {
        throw new Error("not yet implemented");
    }
}