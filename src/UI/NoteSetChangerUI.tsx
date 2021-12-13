import { useEffect } from "react";
import { NoteSetChanger } from "../musicEngine/NoteSetChanger";
import { NoteSetsQueue } from "../musicEngine/NoteSetsQueue";

type Props = {
    noteCounter: number
    setNoteSetsQueue: React.Dispatch<NoteSetsQueue>
    noteSetChanger: NoteSetChanger
};

/**
 * return to main UI the NoteSetList
 * @returns 
 */
export function NoteSetChangerUI({ noteCounter, setNoteSetsQueue, noteSetChanger }: Props) {

    useEffect(() => {
        noteSetChanger.nextNotePlayed();
        setNoteSetsQueue(noteSetChanger.getNoteSetsQueue());
    }, [noteCounter, setNoteSetsQueue]);

    return (<></>)
}