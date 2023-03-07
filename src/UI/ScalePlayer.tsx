import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {useEffect, useState} from 'react';
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

export function ScalePlayer() {
    /** notes per minute */
    const [npm, setNpm] = useState<number>(60);
    const [isPlaying, setPlaying] = useState<boolean>(false);
    const [range, setRange] = useState<NoteRange>(new NoteRange(new Note(0, 0), new Note(7 * 2, 0)));
    const [chordMappingGlobal, setChordMappingGlobal] = useState<ChordMappingGlobal>(ChordMappingGlobal.DEFAULT_MAPPING);
    const [notesPerSet, setNotesPerSet] = useState<number>(4);

    // noteSetProvider fills noteSetsQueue which give the current noteSet from which create the NoteProvider
    const [noteSetProvider, setNoteSetProvider] = useState<INoteSetProvider>(new NoteSetProviderFixed([NoteSetTypes.MAJOR]));

    const [noteSetsQueue, setNoteSetsQueue] = useState<NoteSetsQueue>(new NoteSetsQueue(2, noteSetProvider));
    useEffect(() => { setNoteSetsQueue(new NoteSetsQueue(2, noteSetProvider)) }, [noteSetProvider]);

    return (
        <div id="scalePlayer" className="container-fluid">
            <div className="row">
                <div className="col-md-1"><PlayButton isPlaying={isPlaying} setPlaying={setPlaying} /></div>
                <div className="col-md-11"><SpeedControls npm={npm} setNpm={setNpm} /></div>
            </div>
            <div className="row">
                <div className="col-md-6"><NoteSetUI title="Current" noteSet={noteSetsQueue.peek(0)} /></div>
                <div className="col-md-6"><NoteSetUI title="Next" noteSet={noteSetsQueue.peek(1)} /></div>
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
                <RangeUI range={range} setRange={setRange} />
            </div>

            <ChordMappingGlobalUI
                chordMappingGlobal={chordMappingGlobal}
                setChordMappingGlobal={setChordMappingGlobal}
            />

            <Player
                isPlaying={isPlaying}
                noteSetProvider={noteSetProvider}
                notesPerNoteSet={notesPerSet}
                range={range}
            />
        </div>
    )
}
