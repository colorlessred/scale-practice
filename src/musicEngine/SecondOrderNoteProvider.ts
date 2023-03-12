import { Note } from "./Note";
import { NoteProvider } from "./NoteProvider";
import { NoteRange } from "./NoteRange";
import { NoteSet } from "./NoteSet";
import { INoteSetProvider } from "./NoteSetProviders";
import { IProvider } from "./utilities/IProvider";
import { SecondOrderProvider } from "./utilities/SecondOrderProvider";

// TODO probably obsolete
export class SecondOrderNoteProvider implements IProvider<Note> {
    readonly noteSetProvider: INoteSetProvider;
    readonly notesPerNoteSet: number;
    readonly range: NoteRange;
    readonly firstNote: Note;

    secondOrderProvider: SecondOrderProvider<NoteSet, NoteProvider, Note>;

    constructor(noteSetProvider: INoteSetProvider, notesPerNoteSet: number, range: NoteRange, firstNote: Note) {
        this.noteSetProvider = noteSetProvider;
        this.notesPerNoteSet = notesPerNoteSet;
        this.range = range;
        this.firstNote = firstNote;
        //
        this.secondOrderProvider = new SecondOrderProvider(
            noteSetProvider,
            notesPerNoteSet,
            (noteSet: NoteSet, previousProvider: NoteProvider) => {
                let out: NoteProvider;
                if (previousProvider !== undefined) {
                    // reuse previous provider, changing the noteSet
                    out = previousProvider;
                    out.setNoteSet(noteSet);
                } else {
                    // instantiate the first time
                    out = new NoteProvider(this.firstNote, noteSet, this.range, true);
                }

                return out;
            }
        )
    }

    getNoteSet(): NoteSet {
        return this.secondOrderProvider.getCurrentS();
    }

    getNext(): Note {
        return this.secondOrderProvider.getNext();
    }

    reset(): void {
        throw new Error("Method not implemented.");
    }
}