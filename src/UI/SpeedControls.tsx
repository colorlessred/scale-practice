import React from "react";
import { SpeedControlManual } from "./SpeedControlManual";

type Props = {
    getNpm: () => number,
    setNpm: (newValue: number) => void,
}

// control player speed
export function SpeedControls({ getNpm, setNpm }: Props) {

    return (
        <div id="SpeedControls" className="row">
            <div className="col-md-5">
                <input className="form-check-input" type="checkbox" id="auto-speed-up" />
                <label className="form-check-label" htmlFor="coding">Auto Speed-Up</label>
            </div>
            <div className="col-md-3">
                <p className="col-md-6">{getNpm()} bpm</p>
            </div>
            <div className="col-md-3">
                <SpeedControlManual step={5} getSpeed={getNpm} setSpeed={setNpm} />
                <SpeedControlManual step={-5} getSpeed={getNpm} setSpeed={setNpm} />
            </div>
        </div>
    )
}