import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Clock } from '../UI/Clock';
import { Note } from '../musicEngine/Note';
import { NoteRange } from '../musicEngine/NoteRange';
import { NoteSet } from '../musicEngine/NoteSet';
import { INoteSetProvider, NoteSetProviderFixed } from '../musicEngine/NoteSetProviders';
import { NoteSetsQueue } from '../musicEngine/NoteSetsQueue';
import { NoteSetUI } from './NoteSetUI';
import { NoteProviderUI } from './NoteProducerUI';
import { NoteSetChangerUI } from './NoteSetChangerUI';
import { NoteSetProviderUI } from './NoteSetProviderUI';
import { PlayButton } from './PlayButton';
import { Player } from './Player';
import { RangeUI } from './RangeUI';
import { SpeedControls } from './SpeedControls';

export function ScalePlayer() {
    /** notes per minute */
    const [npm, setNpm] = useState<number>(60);
    const [isPlaying, setPlaying] = useState<boolean>(false);
    const [noteCounter, setNoteCounter] = useState<number>(0);
    const [range, setRange] = useState<NoteRange>(new NoteRange(new Note(0, 0), new Note(7 * 2, 0)));
    const [currentNote, setCurrentNote] = useState<Note>(range.getMin());
    const [noteSetProvider, setNoteSetProvider] = useState<INoteSetProvider>(new NoteSetProviderFixed([NoteSet.Types.MAJOR]));
    const [noteSetsQueue, setNoteSetsQueue] = useState<NoteSetsQueue>(new NoteSetsQueue(2, noteSetProvider));

    function tick() {
        let ms = new Date().getTime();
        ms = ms - Math.floor(ms / 1000) * 1000
        console.log("#############  TICK ############# " + ms);
        setNoteCounter(noteCounter + 1);
    }

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
                    <NoteSetChangerUI
                        noteCounter={noteCounter}
                        noteSetProvider={noteSetProvider}
                        notesPerSet={4}
                        setNoteSetsQueue={setNoteSetsQueue}
                    />
                    <NoteSetProviderUI noteSetProvider={noteSetProvider} setNoteSetProvider={setNoteSetProvider} />
                    {/* TODO: new UI component to display the NoteSetList */}
                </div>
            </div>
            <div className="row">

            </div>
            <div className="row">
                <RangeUI range={range} setRange={setRange} />
            </div>
            <Clock
                isPlaying={isPlaying}
                getNpm={() => { return npm }}
                callback={tick}
            />

            <NoteProviderUI
                noteCounter={noteCounter}
                currentNote={currentNote}
                setCurrentNote={setCurrentNote}
                noteSet={noteSetsQueue.peek(0)}
                range={range} />

            <Player isPlaying={isPlaying} note={currentNote} />
            <div>
                {currentNote.toString()}, {currentNote.getChromaticValue()}
            </div>
        </div>
    )
}
