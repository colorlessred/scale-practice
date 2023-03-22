import React, {useEffect, useState} from "react";
import {Note} from "../musicEngine/Note";
import {NoteRange} from "../musicEngine/NoteRange";
import {Col, Row} from "react-bootstrap";

type Props = {
    range: NoteRange;
    setRange: React.Dispatch<NoteRange>
}

// select the range of notes that can be played
export function RangeUI({range, setRange}: Props) {
    const [minValue, setMinValue] = useState<number>(range.getMin().chromaticValue);
    const [extension, setExtension] = useState<number>(range.getMax().chromaticValue - range.getMin().chromaticValue);

    function minNoteHandler(ev: React.ChangeEvent<HTMLInputElement>) {
        setMinValue(Number(ev.target.value));
    }

    function extensionHandler(ev: React.ChangeEvent<HTMLInputElement>) {
        setExtension(Number(ev.target.value));
    }

    useEffect(() => {
        setRange(new NoteRange(Note.fromChromaticValue(minValue, true), Note.fromChromaticValue(minValue + extension, true)));
    }, [minValue, extension, setRange]);


    return (
        <Row id="range">
            <Col md={6}>
                <label htmlFor="rangeMinNote" className="form-label">Min Note: {`${range.getMin()}`}</label>
                <input type="range" className="form-range" min="0" max="14" value={minValue} id="rangeMinNote"
                       onChange={minNoteHandler}/>
            </Col>
            <Col md={6}>
                <label htmlFor="rangeExtension" className="form-label">Max Note: {`${range.getMax()}`}</label>
                <input type="range" className="form-range" min="12" max="36" value={extension} id="rangeExtension"
                       onChange={extensionHandler}/>
            </Col>
        </Row>
    );
}