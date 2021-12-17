import { NoteSet } from "./NoteSet";
import { AutoQueue } from "./utilities/AutoQueue";

/**
 * queue with the NoteSets that will be played
 */
export class NoteSetsQueue extends AutoQueue<NoteSet> {

    // public filterNextHook(nextItem: NoteSet): NoteSet {
    //     // remove unnecessary alterations from the NoteSets pushed into the queue
    //     return nextItem.minimizeAlterations();
    // }

}