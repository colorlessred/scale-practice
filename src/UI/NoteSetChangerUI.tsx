import React, { useEffect, useRef } from "react";
import { NoteSet } from "../musicEngine/NoteSet";
import { NoteSetChanger } from "../musicEngine/NoteSetChanger";
import { NoteSetsQueue } from "../musicEngine/NoteSetsQueue";
import { IProvider } from "../musicEngine/utilities/Provider";

type Props = {
    noteCounter: number;
    noteSetProvider: IProvider<NoteSet>,
    setNoteSetsQueue: (noteSetsQueue: NoteSetsQueue) => void;
    notesPerSet: number;
};

/**
 * return to main UI the NoteSetList
 * @returns 
 */
export function NoteSetChangerUI({ noteCounter, setNoteSetsQueue: setNoteSetList, noteSetProvider, notesPerSet }: Props) {
    const noteSetChangerRef = useRef<NoteSetChanger>(new NoteSetChanger(notesPerSet, noteSetProvider));

    useEffect(() => { noteSetChangerRef.current.setNoteSetProvider(noteSetProvider) }, [noteSetProvider]);
    useEffect(() => { noteSetChangerRef.current.setNotesPerNoteSet(notesPerSet) }, [notesPerSet]);

    useEffect(() => {
        noteSetChangerRef.current.nextNotePlayed();
        setNoteSetList(noteSetChangerRef.current.getNoteSetsList());
    }, [noteCounter, setNoteSetList]);

    return (<></>)
}