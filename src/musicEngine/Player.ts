import {IProvider} from "./utilities/IProvider";
import {Note} from "./Note";
import * as Tone from "tone";
import {Loop} from "tone";

export class Player {
    private _noteProvider: IProvider<Note> | undefined;
    private _npm: number | undefined;
    /**
     * note duration, in seconds.
     * it is also the interval in time between the notes being played
     */
    private _interval: number | undefined;
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
        this.npm = undefined;
        this._setCurrentNote = setCurrentNote;
    }

    private static async startTone() {
        await Tone.start();
        console.log('Tone.start');
        Tone.Transport.start();
    }

    set noteProvider(noteProvider: IProvider<Note> | undefined) {
        if (!noteProvider) {
            this.stop();
        }
        this._noteProvider = noteProvider;
    }

    set npm(value: number | undefined) {
        this._npm = value;
        if (value === undefined) {
            this._interval = undefined;
        } else {
            this._interval = 60 / value;
        }
    }

    private playNote(time: number) {
        // console.log(`play note, time ${time}`);
        if (this._noteProvider && this._interval) {
            console.log(`playNote() with duration ${this._interval}`);
            const noteToPlay = this._noteProvider.getNext();
            this._setCurrentNote(noteToPlay);
            // modify the loop interval, in case the speed has changed
            const loop = this._loop;
            if (loop && loop.interval != this._interval) {
                loop.interval = this._interval;
            }
            this.synth.triggerAttackRelease(noteToPlay.getFrequency(), this._interval, time, 0.5);
        }
    }

    public start() {
        console.log(`Player.start(), duration: ${this._interval}`);
        if (!this._loop) {
            Player.startTone();
        }
        this._loop = new Tone.Loop(
            // NB: this needs the arrow function otherwise the `this` in playNote will be the loop
            (time) => {
                this.playNote(time);
            }, this._interval);
        this._loop.start();
    }

    public stop() {
        if (this._loop) {
            this._loop.stop();
        }
    }
}
