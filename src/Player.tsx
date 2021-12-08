import { useEffect, useRef, useState } from "react";
import { Note } from "./musicEngine/Note";
import { Synth, Transport, start } from 'tone';

type Props = {
    note: Note;
    isPlaying: boolean;
}


async function startTone() {
    await start();
}

export function Player({ note, isPlaying }: Props) {
    const synth = useRef<Synth>(new Synth().toDestination());
    const [isSetup, setIsSetup] = useState<boolean>(false);

    function stop() {
        Transport.stop();
    }

    useEffect(() => {
        if (isPlaying) {
            if (!isSetup) {
                startTone();
                setIsSetup(true);
            }
            Transport.start();
        } else {
            stop();
        }

        return stop;
    }, [isPlaying, isSetup]);

    useEffect(() => {
        if (isPlaying) {
            synth.current.triggerAttackRelease(note.getFrequency(), 0.2);
        }
    }, [isPlaying, note]);

    return (<span>{isSetup ? 'setup' : 'not setup'}</span>)
}