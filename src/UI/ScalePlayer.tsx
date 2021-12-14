import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from 'react';
import { ChordMappingGlobal } from '../musicEngine/ChordMappingParser';
import { Note } from '../musicEngine/Note';
import { NoteRange } from '../musicEngine/NoteRange';
import { NoteSet } from '../musicEngine/NoteSet';
import { NoteSetChanger } from '../musicEngine/NoteSetChanger';
import { INoteSetProvider, NoteSetProviderFixed } from '../musicEngine/NoteSetProviders';
import { NoteSetsQueue } from '../musicEngine/NoteSetsQueue';
import { ChordMappingGlobalUI } from './ChordMappingUI';
import { NoteSetProviderUI } from './NoteSetProviderUI';
import { NoteSetUI } from './NoteSetUI';
import { PlayButton } from './PlayButton';
import { Player } from './Player';
import { RangeUI } from './RangeUI';
import { SpeedControls } from './SpeedControls';

export function ScalePlayer() {
    /** notes per minute */
    const [npm, setNpm] = useState<number>(60);
    const [isPlaying, setPlaying] = useState<boolean>(false);
    const [range, setRange] = useState<NoteRange>(new NoteRange(new Note(0, 0), new Note(7 * 2, 0)));
    const [noteSetProvider, setNoteSetProvider] = useState<INoteSetProvider>(new NoteSetProviderFixed([NoteSet.Types.MAJOR]));
    const [noteSetsQueue, setNoteSetsQueue] = useState<NoteSetsQueue>(new NoteSetsQueue(2, noteSetProvider));
    const [chordMappingGlobal, setChordMappingGlobal] = useState<ChordMappingGlobal>(ChordMappingGlobal.EMPTY_MAPPING);
    const [notesPerSet, setNotesPerSet] = useState<number>(4);

    const noteSetChanger = useRef<NoteSetChanger>(new NoteSetChanger(notesPerSet, noteSetProvider));
    useEffect(() => { noteSetChanger.current.setNotesPerNoteSet(notesPerSet); }, [notesPerSet]);
    useEffect(() => { noteSetChanger.current.setNoteSetProvider(noteSetProvider); }, [noteSetProvider]);

    return (
        <div id="scalePlayer" className="container-fluid">
            <div className="row">
                <div className="col-md-1"><PlayButton isPlaying={() => { return isPlaying }} setPlaying={setPlaying} /></div>
                <div className="col-md-11"><SpeedControls getNpm={() => { return npm }} setNpm={setNpm} /></div>
            </div>
            <div className="row">
                <div className="col-md-6"><NoteSetUI title="Current" noteSet={noteSetsQueue.peek(0)} /></div>
                <div className="col-md-6"><NoteSetUI title="Next" noteSet={noteSetsQueue.peek(1)} /></div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <NoteSetProviderUI
                        noteSetProvider={noteSetProvider}
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
                setChordMappingGlobal={setChordMappingGlobal} />

            <Player
                isPlaying={isPlaying}
                noteSet={noteSetsQueue.peek(0)}
                range={range}
                noteSetChanger={noteSetChanger.current}
                setNoteSetsQueue={setNoteSetsQueue}
            />
            <div>{noteSetsQueue.toString()}</div>
        </div>
    )
}
