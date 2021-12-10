import { useCallback, useEffect, useState } from "react";
import { ChordMapping, ChordMappingGlobal } from "../musicEngine/ChordMappingParser";

const DEFAULT_MAPPING_TEXT = `7+: mode 1 of Major
7: mode 5 of Major
m7add6: mode 2 of Major`;

type ChordMappingGlobalUIProps = {
    readonly chordMappingGlobal: ChordMappingGlobal;
    readonly setChordMappingGlobal: React.Dispatch<ChordMappingGlobal>;
}

/**
 * let the user specify the mapping between the chord symbols and the modes
 */
export function ChordMappingGlobalUI({ chordMappingGlobal, setChordMappingGlobal }: ChordMappingGlobalUIProps) {
    const [error, setError] = useState<string>('');
    const [text, setText] = useState<string>('');

    // load the default values if the passed mapping is empty
    useEffect(() => {
        if (!chordMappingGlobal || chordMappingGlobal.mappings.length === 0) {
            setChordMappingGlobal(ChordMappingGlobal.parse(DEFAULT_MAPPING_TEXT));
        }
    }, [chordMappingGlobal, setChordMappingGlobal]);


    useEffect(() => {
        setText(chordMappingGlobal.toString());
        setError('');
    }, [chordMappingGlobal, setText, setError]);

    const onChange = useCallback((ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
            const parsed = ChordMappingGlobal.parse(ev.target.value);
            setChordMappingGlobal(parsed);
            return true;
        } catch (e) {
            setText(ev.target.value);
            if (e instanceof Error) {
                setError(e.message);
            }
        }
    }, [setError, setChordMappingGlobal]);

    return (<div className="row">
        <div className="col">
            <textarea className="form-control" onChange={onChange} value={text} rows={chordMappingGlobal.mappings.length + 1} />
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