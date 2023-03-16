import React, {useCallback, useEffect, useRef, useState} from "react";
import * as Tone from 'tone';
import {Note} from "../musicEngine/Note";
import {IProvider} from "../musicEngine/utilities/IProvider";

type Props = {
    readonly isPlaying: boolean
    readonly noteProvider: IProvider<Note> | undefined
    readonly npm: number;
}

// TODO: maybe move the start to the main class when it gets some user input? also start/stop transport there.
async function startTone() {
    await Tone.start();
    console.log('Tone.start');
}

export function Player({isPlaying, noteProvider, npm}: Props) {
    const loop = useRef<Tone.Loop>();
    const synth = useRef<Tone.Synth>(new Tone.Synth({
        envelope: {attack: 0.01, decay: 0.01, sustain: 0.5, release: 0.1}
    }).toDestination());
    const [note, setNote] = useState<Note>();

    /**
     * duration in seconds of the note
     */
    const [duration, setDuration] = useState<number>(1);
    useEffect(() => {
        console.log(`npm: ${npm}`);
        setDuration(60 / npm);
    }, [npm]);

    const playNote = useCallback((time) => {
        console.log(`duration: ${duration}`);
        if (noteProvider) {
            const noteToPlay = noteProvider.getNext();
            synth.current.triggerAttackRelease(noteToPlay.getFrequency(), duration, time, 0.5);
            // modify the loop interval, in case the speed has changed
            console.log(`duration: ${duration}, note: ${noteToPlay}`);
            if (loop.current && loop.current.interval != duration) {
                console.log(`duration has changed, bpm=${npm}`);
                loop.current.stop();
                loop.current = new Tone.Loop(playNote, duration);
            }
            setNote(noteToPlay);
        }
    }, [setNote, noteProvider, duration]);

    useEffect(() => {
        if (isPlaying) {
            if (!loop.current) {
                startTone();
                loop.current = new Tone.Loop(playNote, duration);
            }
            loop.current.start();
            Tone.Transport.start();
        } else {
            if (loop.current) {
                Tone.Transport.stop();
                loop.current.stop();
            }
        }
    }, [isPlaying, loop, playNote]);

    return (<>{note?.toString()}</>);
}