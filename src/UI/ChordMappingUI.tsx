import { useCallback, useEffect, useRef, useState } from "react";
import { ChordMapping, ChordMappingGlobal } from "../musicEngine/ChordMappingParser";

const DEFAULT_MAPPING_TEXT = `7+: mode 1 of Major
7: mode 5 of Major
m7add6: mode 2 of Major`;

type ChordMappingGlobalUIProps = {
    readonly chordMappingGlobal: ChordMappingGlobal
    readonly setChordMappingGlobal: React.Dispatch<ChordMappingGlobal>
}

/**
 * let the user specify the mapping between the chord symbols and the modes
 */
export function ChordMappingGlobalUI({ chordMappingGlobal, setChordMappingGlobal }: ChordMappingGlobalUIProps) {
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

    return (<div className="row">
        <div className="col">
            <textarea
                className="form-control"
                onChange={onChange}
                value={text}
                rows={chordMappingGlobal.mappings.length + 1}
            />
            <div className="col">{error}</div>
        </div>
        <div className="col">{chordMappingGlobal.mappings.map((chordMapping) => {
            return <ChordMappingUI key={`${chordMapping}`} chordMapping={chordMapping} />
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