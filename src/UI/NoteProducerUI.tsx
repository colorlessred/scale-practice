import {useEffect, useRef} from "react";
import {Note} from "../musicEngine/Note";
import {Direction, NoteAndDirection, NoteProvider} from "../musicEngine/NoteProvider";
import {NoteRange} from "../musicEngine/NoteRange";
import {NoteSet} from "../musicEngine/NoteSet";

type Props = {
    noteCounter: number;
    currentNote: Note;
    setCurrentNote: (note: Note) => void;
    noteSet: NoteSet;
    range: NoteRange;
}

export function NoteProviderUI({noteCounter, currentNote, setCurrentNote, noteSet, range}: Props) {
    const noteProducerRef = useRef<NoteProvider>(new NoteProvider(new NoteAndDirection(currentNote, Direction.UP), noteSet, range));

    useEffect(() => {
        noteProducerRef.current.setNoteSet(noteSet);
    }, [noteSet]);
    useEffect(() => {
        noteProducerRef.current.setNoteRange(range);
    }, [range]);

    useEffect(() => {
        setCurrentNote(noteProducerRef.current.getNext());
    }, [noteCounter, setCurrentNote]);

    return (<></>);
}