import {NoteAndDirection, NoteProvider} from "./NoteProvider";
import {IProvider} from "./utilities/IProvider";
import {NoteRange} from "./NoteRange";
import {NoteSet} from "./NoteSet";

/**
 * given a provider of NoteSets it creates a provider of NoteProvider by creating and chaining the appropriate NoteProviders
 */
export class NoteProviderProvider implements IProvider<NoteProvider> {
    private readonly noteSetProvider: IProvider<NoteSet>;
    private readonly noteRange: NoteRange;

    // variables
    private currentNoteProvider: NoteProvider;
    private isFirst: boolean;

    constructor(noteSetProvider: IProvider<NoteSet>, noteRange: NoteRange, noteAndDirection: NoteAndDirection) {
        this.noteSetProvider = noteSetProvider;
        this.noteRange = noteRange;
        this.isFirst = true;
        // create the first NoteProvider, default to the lowest note in the range and going up direction
        this.currentNoteProvider = new NoteProvider(noteAndDirection, noteSetProvider.getNext(), noteRange);
        console.log(`new NoteProviderProvider`);
    }

    getNext(): NoteProvider {
        if (this.isFirst) {
            this.isFirst = false;
            return this.currentNoteProvider;
        } else {
            const nextNoteSet = this.noteSetProvider.getNext();
            this.currentNoteProvider = new NoteProvider(
                this.currentNoteProvider.getNoteAndDirection(),
                nextNoteSet, this.noteRange
            );
            // NB: set isFirst to false, so that when getting the first Note it will
            // advance, even if the current note is in the NoteSet. Otherwise, if the
            // last Note of the previous NoteSet is contained in the next NoteSet it
            // will be repeated
            this.currentNoteProvider.setIsFirst(false);
            console.log(`next NoteProvider: ` + this.currentNoteProvider.toString());
            return this.currentNoteProvider;
        }
    }

    reset(): void {
        throw new Error("not yet implemented");
    }
}