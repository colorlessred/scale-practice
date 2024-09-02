import {Note} from "../musicEngine/Note";
import {Card} from "react-bootstrap";

export function NoteUI({note, extra}: { note: Note | undefined, extra?: string | undefined }) {
    return (<>
        <Card>
            {note && (
                <Card.Body>
                    <Card.Text className="noteOctave">{note.octave}</Card.Text>
                    <Card.Title
                        className="baseNote">{note.baseNote.toString()}<span
                        className="noteExtra">{extra && extra}</span></Card.Title>
                </Card.Body>
            )}
        </Card>
    </>);
}