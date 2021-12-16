import { useCallback, useEffect, useRef, useState } from "react";
import { ChordMapping, ChordMappingGlobal } from "../musicEngine/ChordMappingParser";

const DEFAULT_MAPPING_TEXT = `7+: mode 1 of Major
7: mode 5 of Major
m7add6: mode 2 of Major`;

type ChordMappingGlobalUIProps = {
    readonly setChordMappingGlobal: React.Dispatch<ChordMappingGlobal>;
}

/**
 * let the user specify the mapping between the chord symbols and the modes
 */
export function ChordMappingGlobalUI({ setChordMappingGlobal: setParentChordMappingGlobal }: ChordMappingGlobalUIProps) {
    const [error, setError] = useState<string>('');
    const [text, setText] = useState<string>('');

    const [chordMappingGlobal, setChordMappingGlobal] =
        useState<ChordMappingGlobal>(ChordMappingGlobal.parse(DEFAULT_MAPPING_TEXT));

    const refTextarea = useRef();

    // set up values the first time only
    useEffect(() => {
        setText(chordMappingGlobal.toString());
        setError('');
        setParentChordMappingGlobal(chordMappingGlobal);
    }, []);

    useEffect(() => {
        // setText(chordMappingGlobal.toString());
        setError('');
        setParentChordMappingGlobal(chordMappingGlobal);
    }, [chordMappingGlobal, setError]);

    const onChange = useCallback((ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textValue = ev.target.value;
        try {
            const parsed = ChordMappingGlobal.parse(textValue);
            setChordMappingGlobal(parsed);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
        // keep the test the same in case if comes from user input
        setText(textValue);
    }, [setError, setChordMappingGlobal]);

    return (<div className="row">
        <div className="col">
            <textarea
                ref={refTextarea.current}
                className="form-control"
                onChange={onChange}
                value={text}
                rows={chordMappingGlobal.mappings.length + 1}
            />
            <div className="col">{error}</div>
        </div>
        <div className="col">{chordMappingGlobal.mappings.map((chordMapping) => {
            return <ChordMappingUI chordMapping={chordMapping} />
        })}</div>
    </div>)
}

type ChordMappingUIProps = {
    chordMapping: ChordMapping;
}

function ChordMappingUI({ chordMapping }: ChordMappingUIProps) {
    return (<div className="row">
        <div className="col">{chordMapping.name}</div>
        <div className="col">mode {chordMapping.mode}</div>
        <div className="col">of {chordMapping.baseNoteSet.getName()}</div>
        <div className="col"> {chordMapping.noteSetMode.toString()}</div>
    </div>)
}