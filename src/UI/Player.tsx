import { useCallback, useEffect, useRef, useState } from "react";
import { Note } from "../musicEngine/Note";
import * as Tone from 'tone';

type Props = {
    note: Note;
    isPlaying: boolean;
}

// TODO: understand and fix this
async function startTone() {
    await Tone.start();
    console.log('Tone.start');
}

export function Player({ note, isPlaying }: Props) {
    const [isSetup, setIsSetup] = useState<boolean>(false);

    const synth = useRef<Tone.Synth>(new Tone.Synth({
        envelope: { attack: 0.1, decay: 0.2, sustain: 1, release: 0.1}
    }).toDestination());

    const stop = useCallback(() => {
        console.log('stop');
        Tone.Transport.stop();
    }, []);

    useEffect(() => {
        if (isPlaying) {
            if (!isSetup) {
                startTone();
                setIsSetup(true);
                Tone.Transport.start();
            }
        } else { stop(); }

        return stop;
    }, [isPlaying, stop, isSetup]);

    useEffect(() => {
        if (isPlaying && isSetup) {
            synth.current.triggerAttackRelease(note.getFrequency(), 0.2);
        }
    }, [isPlaying, isSetup, note, synth]);

    return (<span>{isSetup ? 'setup' : 'not setup'}</span>)
}