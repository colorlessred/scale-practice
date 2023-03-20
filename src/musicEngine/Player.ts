import {IProvider} from "./utilities/IProvider";
import {Note} from "./Note";
import * as Tone from "tone";
import {Loop} from "tone";

/**
 * we play quarter notes, with a variable transport BPM speed

 */
const NOTE_DURATION = '4n';

/**
 * Plays the notes it gets from an IProvider<Note>, hiding the underlying the implementation
 */
export class Player {
    private _noteProvider: IProvider<Note> | undefined;
    /**
     * beats per minute. We are playing quarter notes
     * @private
     */
    private _bpm: number | undefined;
    private _loop: Loop | undefined;

    private synth = new Tone.Synth({
        envelope: {attack: 0.01, decay: 0.01, sustain: 0.5, release: 0.1}
    }).toDestination();

    /**
     * function to call when we have obtained the note to be played
     * @private
     */
    private readonly _setCurrentNote: (note: Note) => void;

    constructor(setCurrentNote: (note: Note) => void) {
        this.noteProvider = undefined;
        this.bpm = undefined;
        this._setCurrentNote = setCurrentNote;
    }

    private static async startTone() {
        await Tone.start();
        Tone.Transport.start();
    }

    set noteProvider(noteProvider: IProvider<Note> | undefined) {
        if (!noteProvider) {
            this.stop();
        }
        this._noteProvider = noteProvider;
    }

    /**
     * manage the playback speed in beats per minute
     * @param value
     */
    set bpm(value: number | undefined) {
        this._bpm = value;
        if (value === undefined) {
            this.stop();
        } else {
            Tone.Transport.bpm.value = value;
        }
    }

    private playNote(time: number) {
        if (this._noteProvider) {
            const noteToPlay = this._noteProvider.getNext();
            this._setCurrentNote(noteToPlay);
            this.synth.triggerAttackRelease(noteToPlay.getFrequency(), NOTE_DURATION, time, 0.5);
        }
    }

    public start() {
        if (!this._loop) {
            Player.startTone();
        }
        this._loop = new Tone.Loop(
            // NB: this needs the arrow function otherwise the `this` in playNote will be the loop
            (time) => {
                this.playNote(time);
            }, NOTE_DURATION);
        this._loop.start();
    }

    public stop() {
        if (this._loop) {
            this._loop.stop();
        }
    }
}
