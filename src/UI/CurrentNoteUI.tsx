import {Note} from "../musicEngine/Note";
import {Card} from "react-bootstrap";
import {NoteUI} from "./NoteUI";

type Props = {
    note: Note | undefined;
    title: string;
}

export function CurrentNoteUI({note, title}: Props) {
    return (<>
        <Card>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <NoteUI note={note}></NoteUI>
                {/*<Card.Text className="currentNote">{note ? `${note}` : 'none'}</Card.Text>*/}
            </Card.Body>
        </Card>
    </>);
}