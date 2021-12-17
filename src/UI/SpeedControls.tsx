import { SpeedControlManual } from "./SpeedControlManual";

type Props = {
    npm: number,
    setNpm: (newValue: number) => void,
}

// control player speed
export function SpeedControls({ npm, setNpm }: Props) {

    return (
        <div id="SpeedControls" className="row">
            <div className="col-md-5">
                <input className="form-check-input" type="checkbox" id="auto-speed-up" />
                <label className="form-check-label" htmlFor="coding">Auto Speed-Up</label>
            </div>
            <div className="col-md-3">
                <p className="col-md-6">{npm} bpm</p>
            </div>
            <div className="col-md-3">
                <SpeedControlManual step={5} speed={npm} setSpeed={setNpm} />
                <SpeedControlManual step={-5} speed={npm} setSpeed={setNpm} />
            </div>
        </div>
    )
}