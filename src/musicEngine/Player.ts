import {IProvider} from "./utilities/IProvider";
import {Note} from "./Note";
import * as Tone from "tone";
import {Loop} from "tone";

export class Player {
    private _noteProvider: IProvider<Note>;
    private _npm: number;
    private _duration: number;
    private _loop: Loop | undefined;

    private synth = new Tone.Synth({
        envelope: {attack: 0.01, decay: 0.01, sustain: 0.5, release: 0.1}
    }).toDestination();

    constructor(noteProvider: IProvider<Note>, npm: number) {
        this._noteProvider = noteProvider;
        this._npm = 1;
        this._duration = 1;

        this.npm = npm;
    }

    set npm(value: number) {
        this._npm = value;
        this._duration = 60 / this._npm;
    }

    private async startTone() {
        await Tone.start();
        console.log('Tone.start');
        Tone.Transport.start();
    }

    private playNote(time: number) {
        console.log(`play note, time ${time}`);
        if (this._noteProvider) {
            const noteToPlay = this._noteProvider.getNext();
            this.synth.triggerAttackRelease(noteToPlay.getFrequency(), this._duration, time, 0.5);
            // modify the loop interval, in case the speed has changed
            if (this._loop && this._loop.interval != this._duration) {
                this._loop.interval = this._duration;
            }
        }
    }

    public start() {
        console.log(`Player.start(), duration: ${this._duration}`);
        if (!this._loop) {
            this.startTone();
        }
        this._loop = new Tone.Loop(
            // NB: this needs the arrow function otherwise the `this` in playNote will be the loop
            (time) => {
                this.playNote(time);
            }, this._duration);
        this._loop.start();
        Tone.Transport.start();
    }

    public stop() {
        if (this._loop) {
            this._loop.stop();
            Tone.Transport.stop();
        }
    }
}
