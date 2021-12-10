import { useEffect, useRef } from "react";
import { Note } from "../musicEngine/Note";
import { NoteProvider } from "../musicEngine/NoteProvider";
import { NoteRange } from "../musicEngine/NoteRange";
import { NoteSet } from "../musicEngine/NoteSet";

type Props = {
    readonly noteCounter: number;
    readonly currentNote: Note;
    readonly setCurrentNote: (note: Note) => void;
    readonly noteSet: NoteSet;
    readonly range: NoteRange;
}

export function NoteProviderUI({ noteCounter, currentNote: note, setCurrentNote: setNote, noteSet, range: noteRange }: Props) {
    const noteProducerRef = useRef<NoteProvider>(new NoteProvider(note, noteSet, noteRange, true));

    useEffect(() => { noteProducerRef.current.setNoteSet(noteSet) }, [noteSet])
    useEffect(() => { noteProducerRef.current.setNoteRange(noteRange) }, [noteRange])

    useEffect(() => {
        setNote(noteProducerRef.current.moveToNextNote());
    }, [noteCounter, setNote]);

    return (<></>)
}