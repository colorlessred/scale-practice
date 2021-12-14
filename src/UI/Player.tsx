import { useCallback, useEffect, useRef } from "react";
import * as Tone from 'tone';
import { NoteProvider } from "../musicEngine/NoteProvider";
import { NoteRange } from "../musicEngine/NoteRange";
import { NoteSet } from "../musicEngine/NoteSet";
import { NoteSetChanger } from "../musicEngine/NoteSetChanger";
import { NoteSetsQueue } from "../musicEngine/NoteSetsQueue";

type Props = {
    // readonly note: Note
    readonly isPlaying: boolean
    readonly noteSet: NoteSet
    readonly range: NoteRange
    readonly noteSetChanger: NoteSetChanger
    readonly setNoteSetsQueue: React.Dispatch<NoteSetsQueue>
}

// TODO: maybe move the start to the main class when it gets some user input? also start/stop transport there.
async function startTone() {
    await Tone.start();
    console.log('Tone.start');
}

export function Player({ isPlaying, noteSet, range, noteSetChanger, setNoteSetsQueue }: Props) {
    const isFirstNote = useRef<boolean>(false);

    const noteProvider = useRef<NoteProvider>(new NoteProvider(range.getMin(), noteSet, range, true));
    useEffect(() => { noteProvider.current.setNoteSet(noteSet) }, [noteSet])
    useEffect(() => { noteProvider.current.setNoteRange(range) }, [range])

    const loop = useRef<Tone.Loop>();

    const synth = useRef<Tone.Synth>(new Tone.Synth({
        envelope: { attack: 0.01, decay: 0.01, sustain: 0.5, release: 0.1 }
    }).toDestination());

    const playNote = useCallback((time) => {
        console.log(`play note, time ${time}`);
        const note = noteProvider.current.getNoteAndMoveToNext();
        synth.current.triggerAttackRelease(note.getFrequency(), 0.3, time);
        setNoteSetsQueue(noteSetChanger.nextNotePlayed());
    }, [noteSetChanger, setNoteSetsQueue]);

    useEffect(() => {
        if (isPlaying) {
            if (isFirstNote.current) {
                isFirstNote.current = false;
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
        }
    }, [isPlaying, isFirstNote.current]);

    return (<></>)
}