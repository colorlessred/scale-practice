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

export function NoteProviderUI({ noteCounter, currentNote, setCurrentNote, noteSet, range }: Props) {
    const noteProducerRef = useRef<NoteProvider>(new NoteProvider(currentNote, noteSet, range, true));

    useEffect(() => { noteProducerRef.current.setNoteSet(noteSet) }, [noteSet])
    useEffect(() => { noteProducerRef.current.setNoteRange(range) }, [range])

    useEffect(() => {
        setCurrentNote(noteProducerRef.current.getNoteAndMoveToNext());
    }, [noteCounter, setCurrentNote]);

    return (<></>)
}