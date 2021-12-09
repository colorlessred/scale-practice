import { useRef, useState } from "react"
import { ChordMapping, ChordMappingGlobal } from "../musicEngine/ChordMappingParser"

const DEFAULT_MAPPING_TEXT = `7+: mode 1 of Major
7: mode 5 of Major
m7add6: mode 2 of Major`;

export function ChordMappingGlobalUI() {
    const chordMappingGlobal = useRef<ChordMappingGlobal>(ChordMappingGlobal.parse(DEFAULT_MAPPING_TEXT));
    const [error, setError] = useState<string>('');

    function onChange(ev: React.ChangeEvent<HTMLTextAreaElement>) {
        try {
            const parsed = ChordMappingGlobal.parse(ev.target.value);
            chordMappingGlobal.current = parsed;
            setError('');
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
    }

    return (<div className="row">
        <div className="col">
            <textarea className="form-control" onChange={onChange}>{chordMappingGlobal.current.toString()}</textarea>
            <div className="col">{error}</div>
        </div>
        <div className="col">{chordMappingGlobal.current.mappings.map((chordMapping) => {
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
    </div>
    )
}