import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from 'tone';
import { Note } from "../musicEngine/Note";
import { NoteRange } from "../musicEngine/NoteRange";
import { INoteSetProvider } from "../musicEngine/NoteSetProviders";
import { SecondOrderNoteProvider } from "../musicEngine/SecondOrderNoteProvider";

type Props = {
    readonly isPlaying: boolean
    readonly noteSetProvider: INoteSetProvider
    range: NoteRange
    notesPerNoteSet: number
}

// TODO: maybe move the start to the main class when it gets some user input? also start/stop transport there.
async function startTone() {
    await Tone.start();
    console.log('Tone.start');
}

export function Player({ isPlaying, noteSetProvider, range, notesPerNoteSet }: Props) {
    const isSetUp = useRef<boolean>(false);
    const isFirstNote = useRef<boolean>(true);

    const [note, setNote] = useState<Note>();

    const loop = useRef<Tone.Loop>();

    const noteProviderRef = useRef<SecondOrderNoteProvider>(
        new SecondOrderNoteProvider(noteSetProvider, notesPerNoteSet, range, range.getMin())
    );

    const synth = useRef<Tone.Synth>(new Tone.Synth({
        envelope: { attack: 0.01, decay: 0.01, sustain: 0.5, release: 0.1 }
    }).toDestination());

    const playNote = useCallback((time) => {
        const noteToPlay = noteProviderRef.current.getNext();
        synth.current.triggerAttackRelease(noteToPlay.getFrequency(), '4n', time, 0.5);
        setNote(noteToPlay);
    }, [setNote]);

    useEffect(() => {
        if (isPlaying) {
            if (isSetUp.current) {
                isSetUp.current = false;
                startTone();
            }
            // TODO fix time
            loop.current = new Tone.Loop(playNote, '4n');
            loop.current.start();
            Tone.Transport.start();
        } else {
            if (loop.current) {
                loop.current.stop();
                Tone.Transport.stop();
            }
            isFirstNote.current = true;
        }
    }, [isPlaying, isSetUp, loop, isFirstNote, playNote]);

    return (<>{note?.toString()}</>)
}