import React, {useCallback, useEffect, useRef, useState} from "react";
import * as Tone from 'tone';
import {Note} from "../musicEngine/Note";
import {IProvider} from "../musicEngine/utilities/IProvider";

type Props = {
    readonly isPlaying: boolean
    readonly noteProvider: IProvider<Note> | undefined
}

// TODO: maybe move the start to the main class when it gets some user input? also start/stop transport there.
async function startTone() {
    await Tone.start();
    console.log('Tone.start');
}

export function Player({isPlaying, noteProvider}: Props) {
    const isSetUp = useRef<boolean>(false);
    const loop = useRef<Tone.Loop>();

    const [note, setNote] = useState<Note>();

    const synth = useRef<Tone.Synth>(new Tone.Synth({
        envelope: {attack: 0.01, decay: 0.01, sustain: 0.5, release: 0.1}
    }).toDestination());

    const playNote = useCallback((time) => {
        if (noteProvider) {
            const noteToPlay = noteProvider.getNext();
            synth.current.triggerAttackRelease(noteToPlay.getFrequency(), '4n', time, 0.5);
            setNote(noteToPlay);
        }
    }, [setNote, noteProvider]);

    useEffect(() => {
        if (isPlaying) {
            if (!isSetUp.current) {
                startTone();
                isSetUp.current = true;
            }
            loop.current = new Tone.Loop(playNote, '4n');
            loop.current.start();
            Tone.Transport.start();
        } else {
            if (loop.current) {
                Tone.Transport.stop();
                loop.current.stop();
            }
        }
    }, [isPlaying, isSetUp, loop, playNote]);

    return (<>{note?.toString()}</>);
}