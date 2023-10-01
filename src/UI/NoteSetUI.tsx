import {NoteSet} from "../musicEngine/NoteSet";
import {Card} from "react-bootstrap";

type Props = {
    title: string;
    noteSet: NoteSet | undefined;
}

export function NoteSetUI({title, noteSet}: Props) {
    // this will eventually display the notes on the staff, probably using opensheetmusicdisplay

    return (
        <Card>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                {(noteSet !== undefined) &&
                    <>
                        <Card.Text className="noteSet">{noteSet.getFullName()}</Card.Text>
                        <Card.Footer>{noteSet.toString()}</Card.Footer>
                    </>
                }
            </Card.Body>
        </Card>
    );
}