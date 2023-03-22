import {NoteSet} from "../musicEngine/NoteSet";

type Props = {
    title: string;
    noteSet: NoteSet | undefined;
}

export function NoteSetUI({title, noteSet}: Props) {
    // this will display the notes on the staff, probably using opensheetmusicdisplay

    const display = (noteSet) ? `${noteSet.getFullName()}: ${noteSet.toString()}` : '';

    return (
        <>
            <label htmlFor={`ns-${title}`}>{title}</label>
            <div className="note-set-ui" id={`ns-${title}`}>
                <span className="noteSet">{display}</span>
            </div>
        </>
    );
}