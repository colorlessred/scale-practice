import {Note} from "../musicEngine/Note";
import {Card} from "react-bootstrap";

type Props = {
    note: Note | undefined;
    title: string;
}

export function CurrentNoteUI({note, title}: Props) {
    return (<>
        <Card>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text className="currentNote">{note ? `${note}` : 'none'}</Card.Text>
            </Card.Body>
        </Card>
    </>);
}