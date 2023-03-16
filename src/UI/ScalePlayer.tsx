import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {ChordMappingGlobal} from '../musicEngine/ChordMappingParser';
import {Note} from '../musicEngine/Note';
import {NoteRange} from '../musicEngine/NoteRange';
import {NoteSet, NoteSetTypes} from '../musicEngine/NoteSet';
import {NoteSetProviderFixed} from '../musicEngine/NoteSetProviders';
import {ChordMappingGlobalUI} from './ChordMappingUI';
import {NoteSetProviderUI} from './NoteSetProviderUI';
import {NoteSetUI} from './NoteSetUI';
import {PlayButton} from './PlayButton';
import {Player} from './Player';
import {RangeUI} from './RangeUI';
import {SpeedControls} from './SpeedControls';
import {IProvider} from "../musicEngine/utilities/IProvider";
import {SteadyChangeProvider} from "../musicEngine/utilities/SteadyChangeProvider";
import {NoteProviderProvider} from "../musicEngine/NoteProviderProvider";
import {Direction, NoteAndDirection} from "../musicEngine/NoteProvider";
import {ProviderProxy} from "../musicEngine/utilities/ProviderProxy";
import {AutoQueue} from "../musicEngine/utilities/AutoQueue";

export function ScalePlayer() {
    /** notes per minute */
    const [npm, setNpm] = useState<number>(60);
    const [isPlaying, setPlaying] = useState<boolean>(false);
    const [noteRange, setNoteRange] = useState<NoteRange>(NoteRange.parse('C(0)-C(2)'));
    const [chordMappingGlobal, setChordMappingGlobal] = useState<ChordMappingGlobal>(ChordMappingGlobal.DEFAULT_MAPPING);
    const [notesPerSet] = useState<number>(4);

    const [noteSetProvider, setNoteSetProvider] = useState<IProvider<NoteSet>>(new NoteSetProviderFixed([NoteSetTypes.MAJOR]));
    const [noteSetQueue, setNoteSetQueue] = useState<AutoQueue<NoteSet>>(new AutoQueue<NoteSet>(2, noteSetProvider));

    useEffect(() => {
        console.log(`changed noteSetProvider`);
        setNoteSetQueue(new AutoQueue<NoteSet>(2, noteSetProvider));
    }, [noteSetProvider]);

    const [currentNoteSet, setCurrentNoteSet] = useState<NoteSet>();
    const [nextNoteSet, setNextNoteSet] = useState<NoteSet>();


    const [noteProvider, setNoteProvider] = useState<IProvider<Note>>();
    useEffect(() => {
        const noteProviderProvider: IProvider<IProvider<Note>> = new NoteProviderProvider(noteSetQueue, noteRange,
            // TODO: this is wrong, it will need to be connected to the previous
            new NoteAndDirection(noteRange.getMin(), Direction.UP));
        const changeProvider = new SteadyChangeProvider(noteProviderProvider, notesPerSet);
        const proxy = new ProviderProxy(changeProvider, () => {
            console.log(noteSetQueue.peek(0).toString());
            setCurrentNoteSet(noteSetQueue.peek(0));
            setNextNoteSet(noteSetQueue.peek(1));
        });
        setNoteProvider(proxy);
    }, [noteRange, notesPerSet, noteSetQueue]);

    return (
        <div id="scalePlayer" className="container-fluid">
            <div className="row">
                <div className="col-md-1"><PlayButton isPlaying={isPlaying} setPlaying={setPlaying}/></div>
                <div className="col-md-11"><SpeedControls npm={npm} setNpm={setNpm}/></div>
            </div>
            <div className="row">
                <div className="col-md-6"><NoteSetUI title="Current" noteSet={currentNoteSet}/></div>
                <div className="col-md-6"><NoteSetUI title="Next" noteSet={nextNoteSet}/></div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <NoteSetProviderUI
                        setNoteSetProvider={setNoteSetProvider}
                        chordMappingGlobal={chordMappingGlobal}
                    />
                </div>
            </div>
            <div className="row">

            </div>
            <div className="row">
                <RangeUI range={noteRange} setRange={setNoteRange}/>
            </div>

            <ChordMappingGlobalUI
                chordMappingGlobal={chordMappingGlobal}
                setChordMappingGlobal={setChordMappingGlobal}
            />

            <Player
                isPlaying={isPlaying}
                noteProvider={noteProvider}
                npm={npm}
            />
        </div>
    );
}
