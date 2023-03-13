import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {ChordMappingGlobal} from '../musicEngine/ChordMappingParser';
import {Note} from '../musicEngine/Note';
import {NoteRange} from '../musicEngine/NoteRange';
import {NoteSet, NoteSetTypes} from '../musicEngine/NoteSet';
import {INoteSetProvider, NoteSetProviderFixed} from '../musicEngine/NoteSetProviders';
import {NoteSetsQueue} from '../musicEngine/NoteSetsQueue';
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

/**
 * proxy that will intercept calls for the next note
 */
class NoteProviderProxy implements IProvider<Note> {
    private readonly noteProvider: IProvider<Note>;
    private readonly afterNext: () => void;

    /**
     *
     * @param noteProvider the IProvider<Note> to wrap
     * @param afterNext the lambda to be called before returning the next note
     */
    constructor(noteProvider: IProvider<Note>, afterNext: () => void) {
        this.noteProvider = noteProvider;
        this.afterNext = afterNext;
    }

    getNext(): Note {
        const note: Note = this.noteProvider.getNext();
        this.afterNext();
        return note;
    }

    reset(): void {
        throw Error("not yet implemented");
    }
}

export function ScalePlayer() {
    /** notes per minute */
    const [npm, setNpm] = useState<number>(60);
    const [isPlaying, setPlaying] = useState<boolean>(false);
    const [noteRange, setNoteRange] = useState<NoteRange>(NoteRange.parse('C(0)-C(2)'));
    const [chordMappingGlobal, setChordMappingGlobal] = useState<ChordMappingGlobal>(ChordMappingGlobal.DEFAULT_MAPPING);
    const [notesPerSet] = useState<number>(4);

    // noteSetProvider fills noteSetsQueue which give the current noteSet from which create the NoteProvider
    // start with a fixed major chord
    const [noteSetProvider, setNoteSetProvider] = useState<INoteSetProvider>(new NoteSetProviderFixed([NoteSetTypes.MAJOR]));
    const [noteSetsQueue, setNoteSetsQueue] = useState<NoteSetsQueue>(new NoteSetsQueue(2, noteSetProvider));

    useEffect(() => {
        setNoteSetsQueue(new NoteSetsQueue(2, noteSetProvider));
    }, [noteSetProvider]);

    const [currentNoteSet, setCurrentNoteSet] = useState<NoteSet>();
    const [nextNoteSet, setNextNoteSet] = useState<NoteSet>();
    const [noteProvider, setNoteProvider] = useState<IProvider<Note>>();

    useEffect(() => {
        const noteProviderProvider = new NoteProviderProvider(noteSetsQueue, noteRange,
            // TODO: this is wrong, it will need to be connected to the previous
            new NoteAndDirection(noteRange.getMin(), Direction.UP));
        const changeProvider = new SteadyChangeProvider(noteProviderProvider, notesPerSet);
        const proxy = new NoteProviderProxy(changeProvider, () => {
            console.log(noteSetsQueue.peek(0).toString());
            setCurrentNoteSet(noteSetsQueue.peek(0));
            setNextNoteSet(noteSetsQueue.peek(1));
        });
        setNoteProvider(proxy);
    }, [noteRange, notesPerSet, noteSetsQueue]);

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
            />
        </div>
    );
}
