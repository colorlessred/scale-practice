import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useMemo, useState} from 'react';
import {ChordMappingGlobal} from '../musicEngine/ChordMappingParser';
import {Note} from '../musicEngine/Note';
import {NoteRange} from '../musicEngine/NoteRange';
import {NoteSet, NoteSetTypes} from '../musicEngine/NoteSet';
import {NoteSetProviderFixed} from '../musicEngine/NoteSetProviders';
import {ChordMappingGlobalUI} from './ChordMappingUI';
import {NoteSetProviderUI} from './NoteSetProviderUI';
import {NoteSetUI} from './NoteSetUI';
import {PlayButton} from './PlayButton';
import {RangeUI} from './RangeUI';
import {SpeedControls} from './SpeedControls';
import {IProvider} from "../musicEngine/utilities/IProvider";
import {SteadyChangeProvider} from "../musicEngine/utilities/SteadyChangeProvider";
import {NoteProviderProvider} from "../musicEngine/NoteProviderProvider";
import {Direction, NoteAndDirection} from "../musicEngine/NoteProvider";
import {ProviderProxy} from "../musicEngine/utilities/ProviderProxy";
import {AutoQueue} from "../musicEngine/utilities/AutoQueue";
import {Player} from "../musicEngine/Player";
import {CurrentNoteUI} from "./CurrentNoteUI";
import {Col, Row} from "react-bootstrap";

Note.setAlterationSymbols('♭', '♯');

export function ScalePlayer() {
    /** notes per minute */
    const [bpm, setBpm] = useState<number>(60);
    const [isPlaying, setPlaying] = useState<boolean>(false);
    const [noteRange, setNoteRange] = useState<NoteRange>(NoteRange.parse('C(0)-C(2)'));
    const [chordMappingGlobal, setChordMappingGlobal] = useState<ChordMappingGlobal>(ChordMappingGlobal.DEFAULT_MAPPING);
    /** to add later UI to modify it **/
    const [notesPerSet] = useState<number>(4);

    /** provides the NoteSets depending on the chosen config, types of note sets, root notes, ... **/
    const [noteSetProvider, setNoteSetProvider] = useState<IProvider<NoteSet>>(new NoteSetProviderFixed([NoteSetTypes.MAJOR]));

    /** automatically load the queue to have the next NoteSet available for display **/
    const noteSetQueue = useMemo(() => new AutoQueue<NoteSet>(2, noteSetProvider), [noteSetProvider]);

    const [currentNoteSet, setCurrentNoteSet] = useState<NoteSet>();
    const [nextNoteSet, setNextNoteSet] = useState<NoteSet>();

    const noteProvider = useMemo(() => {
        const noteProviderProvider: IProvider<IProvider<Note>> = new NoteProviderProvider(noteSetQueue, noteRange,
            new NoteAndDirection(noteRange.getMin(), Direction.UP));
        const changeProvider = new SteadyChangeProvider(noteProviderProvider, notesPerSet);
        return new ProviderProxy(changeProvider, () => {
            setCurrentNoteSet(noteSetQueue.current);
            setNextNoteSet(noteSetQueue.peek(0));
        });
    }, [noteRange, notesPerSet, noteSetQueue]);

    const [currentNote, setCurrentNote] = useState<Note>();

    // init Player using lambda, so it's instantiated only once. Otherwise, the multiple
    // instances will eventually break the underlying Tone lib synth
    const [player] = useState<Player>(() => new Player(setCurrentNote));

    useEffect(() => {
        player.noteProvider = noteProvider;
    }, [player, noteProvider]);

    useEffect(() => {
        player.bpm = bpm;
    }, [player, bpm]);

    useEffect(() => {
        if (isPlaying) {
            player.start();
        } else {
            player.stop();
        }
    }, [player, isPlaying]);

    return (
        <Row id="scalePlayer" className="container-fluid">
            <Row>
                <Col md={1}><PlayButton isPlaying={isPlaying} setPlaying={setPlaying}/></Col>
                <Col md={11}><SpeedControls npm={bpm} setNpm={setBpm}/></Col>
            </Row>
            <Row>
                <Col md={2}><CurrentNoteUI note={currentNote} title={"Current Note"}/></Col>
                <Col md={5}><NoteSetUI title="Current" noteSet={currentNoteSet}/></Col>
                <Col md={5}><NoteSetUI title="Next" noteSet={nextNoteSet}/></Col>
            </Row>
            <Row>
                <Col md={12}>
                    <NoteSetProviderUI
                        setNoteSetProvider={setNoteSetProvider}
                        chordMappingGlobal={chordMappingGlobal}
                    />
                </Col>
            </Row>

            <Row>
                <RangeUI range={noteRange} setRange={setNoteRange}/>
            </Row>

            <ChordMappingGlobalUI
                chordMappingGlobal={chordMappingGlobal}
                setChordMappingGlobal={setChordMappingGlobal}
            />
        </Row>
    );
}
