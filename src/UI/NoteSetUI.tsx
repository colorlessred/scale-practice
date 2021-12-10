import { NoteSet } from "../musicEngine/NoteSet";

type Props = {
    title: string;
    noteSet: NoteSet;
}

export function NoteSetUI({ title, noteSet }: Props) {
    // this will display the notes on the staff, probably using opensheetmusicdisplay
    return (<>
        <label htmlFor={`ns-${title}`}>{title}</label>
        <div className="note-set-ui" id={`ns-${title}`}>
            <span className="noteSet">
                {noteSet.getFullName()}: {noteSet.toString()}
            </span>
        </div>
    </>
    )
}