import { INoteSetProvider } from "./NoteSetProviders";
import { NoteSetsQueue } from "./NoteSetsQueue";

/**
 * moves to the next NoteSet when needed
 */
export class NoteSetChanger {
    private notesPerNoteSet: number;
    private numNotePlayed: number;
    private noteSetsList: NoteSetsQueue;

    constructor(notesPerNoteSet: number, noteSetProvider: INoteSetProvider) {
        this.notesPerNoteSet = notesPerNoteSet;
        this.noteSetsList = new NoteSetsQueue(2, noteSetProvider);
        this.numNotePlayed = 0;
    }

    /**
     * call when a new note is played and the NoteSetChanger will move forward when needed
     * @returns new note set
     */
    public nextNotePlayed(): NoteSetsQueue {
        this.numNotePlayed++;
        if (this.numNotePlayed >= this.notesPerNoteSet) {
            this.numNotePlayed = 0;
            this.noteSetsList.dequeue();
        }
        return this.getNoteSetsList();
    }

    /**
     * return the currently valid 
     */
    public getNoteSetsList(): NoteSetsQueue {
        return this.noteSetsList;
    }

    /**
     * 
     * @param noteSetProvider the current NoteSetProvider
     */
    public setNoteSetProvider(noteSetProvider: INoteSetProvider) {
        this.noteSetsList.setProvider(noteSetProvider);
    }

    /**
     * changes the number of notes to be played in each NoteSet
     * @param notesPerNoteSet 
     */
    public setNotesPerNoteSet(notesPerNoteSet: number) {
        this.notesPerNoteSet = notesPerNoteSet;
    }

}