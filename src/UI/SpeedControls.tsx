import {SpeedControlManual} from "./SpeedControlManual";
import {Col, Row} from "react-bootstrap";

type Props = {
    npm: number,
    setNpm: (newValue: number) => void,
}

// control player speed
export function SpeedControls({npm, setNpm}: Props) {

    return (
        <Row id="SpeedControls">
            <Col md={5}>
                <input className="form-check-input" type="checkbox" id="auto-speed-up"/>
                <label className="form-check-label" htmlFor="coding">Auto Speed-Up</label>
            </Col>
            <Col md={3}>
                <Col md={6}>{npm} bpm</Col>
            </Col>
            <Col md={3}>
                <SpeedControlManual step={5} speed={npm} setSpeed={setNpm}/>
                <SpeedControlManual step={-5} speed={npm} setSpeed={setNpm}/>
            </Col>
        </Row>
    );
}