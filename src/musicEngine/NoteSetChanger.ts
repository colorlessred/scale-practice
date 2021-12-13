import { INoteSetProvider } from "./NoteSetProviders";
import { NoteSetsQueue } from "./NoteSetsQueue";

const NOTE_SETS_IN_QUEUE = 2;

/**
 * moves to the next NoteSet when needed
 */
export class NoteSetChanger {
    private notesPerNoteSet: number;
    private numNotePlayed: number;
    private noteSetsQueue: NoteSetsQueue;

    constructor(notesPerNoteSet: number, noteSetProvider: INoteSetProvider) {
        this.notesPerNoteSet = notesPerNoteSet;
        this.noteSetsQueue = new NoteSetsQueue(NOTE_SETS_IN_QUEUE, noteSetProvider);
        this.numNotePlayed = 0;
    }

    /**
     * call when a new note is played and the NoteSetChanger will move forward when needed
     * returning the appropriate NoteSets in the output queue
     * @returns new note set
     */
    public nextNotePlayed(): NoteSetsQueue {
        this.numNotePlayed++;
        if (this.numNotePlayed >= this.notesPerNoteSet) {
            this.numNotePlayed = 0;
            this.noteSetsQueue.dequeue();
        }
        return this.getNoteSetsQueue();
    }

    /**
     * return queue with NoteSets 
     */
    public getNoteSetsQueue(): NoteSetsQueue {
        return this.noteSetsQueue;
    }

    /**
     * 
     * @param noteSetProvider the current NoteSetProvider
     */
    public setNoteSetProvider(noteSetProvider: INoteSetProvider) {
        this.noteSetsQueue.setProvider(noteSetProvider);
    }

    /**
     * changes the number of notes to be played in each NoteSet
     * @param notesPerNoteSet 
     */
    public setNotesPerNoteSet(notesPerNoteSet: number) {
        this.notesPerNoteSet = notesPerNoteSet;
    }

}