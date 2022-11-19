import { Note } from "./Note";
import { NoteSet } from "./NoteSet";
import { SecondOrderNoteProvider } from "./SecondOrderNoteProvider";
import { AutoQueue } from "./utilities/AutoQueue";
import { IProvider } from "./utilities/IProvider";
import { SecondOrderProvider } from "./utilities/SecondOrderProvider";

export type NoteNoteSet = {
    note: Note
    noteSet: NoteSet
}

export class NoteNoteSetProvider implements IProvider<NoteNoteSet> {
    secondOrderNoteProvider: SecondOrderNoteProvider;

    constructor(secondOrderNoteProvider: SecondOrderNoteProvider) {
        this.secondOrderNoteProvider = secondOrderNoteProvider;
    }

    getNext(): NoteNoteSet {
        const note: Note = this.secondOrderNoteProvider.getNext();
        const noteSet: NoteSet = this.secondOrderNoteProvider.getNoteSet();
        return { note, noteSet };
    }

    reset(): void {
        throw new Error("Method not implemented.");
    }
}


/**
 * read from the SecondOrderNoteProvider and build a queue with both the note and noteSet
 */
export class NoteNoteSetQueue extends AutoQueue<NoteNoteSet>{ }