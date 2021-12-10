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
}

export function Player({ note, isPlaying }: Props) {
    const [isSetup, setIsSetup] = useState<boolean>(false);

    const synth = useRef<Tone.AMSynth>(new Tone.AMSynth({
        envelope: { attack: 0.1, decay: 0.01, sustain: 1, release: 0.5 }
    }).toDestination());


    const stop = useCallback(() => { Tone.Transport.stop(); }, []);

    useEffect(() => {
        if (isPlaying) {
            if (!isSetup) {
                startTone();
                setIsSetup(true);
            }
            Tone.Transport.start();
        } else { stop(); }

        return stop;
    }, [isPlaying, isSetup]);

    useEffect(() => {
        if (isPlaying) {
            synth.current.triggerAttackRelease(note.getFrequency(), 0.1, undefined, 2);
        }
    }, [isPlaying, note, synth]);

    return (<span>{isSetup ? 'setup' : 'not setup'}</span>)
}