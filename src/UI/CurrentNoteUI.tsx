import {Note} from "../musicEngine/Note";

type Props = {
    note: Note | undefined;
    title: string;
}

export function CurrentNoteUI({note, title}: Props) {
    return (<>
        <label htmlFor={`ns-${title}`}>{title}</label>
        <div className="current-note">{note ? `${note}` : 'no current note'}</div>
    </>);
}