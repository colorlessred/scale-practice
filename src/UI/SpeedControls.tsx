import {SpeedControlManual} from "./SpeedControlManual";
import {Col, Form, Row} from "react-bootstrap";

type Props = {
    npm: number,
    setNpm: (newValue: number) => void,
}

export function SpeedControls({npm, setNpm}: Props) {
    return (
        <Row>
            <Col id="SpeedControls">
                <Form.Group>
                    <Form.Label>Auto speed-up</Form.Label>
                    <Form.Check></Form.Check>
                </Form.Group>
            </Col>
            <Col>
                <Form.Label>Modify Speed</Form.Label>
                <SpeedControlManual step={-2} speed={npm} setSpeed={setNpm}/>
                <SpeedControlManual step={2} speed={npm} setSpeed={setNpm}/>
                <Form.Label>{npm} bpm</Form.Label>
            </Col>
        </Row>
    );
}