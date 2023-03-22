import {useCallback, useEffect, useRef, useState} from "react";
import {ChordMapping, ChordMappingGlobal} from "../musicEngine/ChordMappingParser";
import {Col, Row} from "react-bootstrap";

const DEFAULT_MAPPING_TEXT = `7+: mode 1 of Major
m7: mode 2 of Major
7: mode 5 of Major
m7+: mode 1 of Melodic Minor
alt: mode 7 of Melodic Minor
7#11: mode 4 of Melodic Minor
m7b5: mode 6 of Melodic Minor
(pM6): mode 1 of Pentatonic Major
(pm6): mode 1 of Pentatonic Min6`;

type ChordMappingGlobalUIProps = {
    chordMappingGlobal: ChordMappingGlobal
    setChordMappingGlobal: React.Dispatch<ChordMappingGlobal>
}

/**
 * let the user specify the mapping between the chord symbols and the modes
 */
export function ChordMappingGlobalUI({chordMappingGlobal, setChordMappingGlobal}: ChordMappingGlobalUIProps) {
    const [error, setError] = useState<string>('');
    const [text, setText] = useState<string>('');

    const isFirstRef = useRef<boolean>(true);

    useEffect(() => {
        if (isFirstRef.current) {
            const chordMappingGlobal = ChordMappingGlobal.parse(DEFAULT_MAPPING_TEXT);
            setChordMappingGlobal(chordMappingGlobal);
            setText(chordMappingGlobal.toString());
        }
        isFirstRef.current = false;
    }, [isFirstRef, setChordMappingGlobal, setText]);

    const onChange = useCallback((ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textValue = ev.target.value;
        try {
            const parsed = ChordMappingGlobal.parse(textValue);
            setChordMappingGlobal(parsed);
            setError('');
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
        // keep the test the same in case if comes from user input
        setText(textValue);
    }, [setError, setChordMappingGlobal]);

    return (
        <Row>
            <Col>
            <textarea
                className="form-control"
                onChange={onChange}
                value={text}
                rows={chordMappingGlobal.mappings.length + 1}
            />
                <Col>{error}</Col>
            </Col>
            <Col>{chordMappingGlobal.mappings.map((chordMapping) => {
                return <ChordMappingUI key={`${chordMapping}`} chordMapping={chordMapping}/>;
            })}</Col>
        </Row>
    );
}

type ChordMappingUIProps = {
    chordMapping: ChordMapping;
}

function ChordMappingUI({chordMapping}: ChordMappingUIProps) {
    return (<Row>
        <Col>{chordMapping.name}</Col>
        <Col>mode {chordMapping.mode}</Col>
        <Col>of {chordMapping.baseNoteSet.getName()}</Col>
        <Col> {chordMapping.noteSetMode.toString()}</Col>
    </Row>);
}