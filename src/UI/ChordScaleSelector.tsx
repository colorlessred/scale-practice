import { useRef } from "react";
import { NoteSet } from "../musicEngine/NoteSet";
// import Types from "./musicEngine/NoteSet"

class ChordScale {
    readonly baseScale: NoteSet;
    readonly modeNumber: number;
    readonly name: string;

    constructor(baseScale: NoteSet, modeNumber: number, name: string) {
        this.baseScale = baseScale;
        this.modeNumber = modeNumber;
        this.name = name;
    }
}

// ##############

const DEFAULT_MAPPING: Array<ChordScale> = [
    // new ChordScale(NoteSet.Types.MAJOR);
];

type CssProps = {

}

export function ChordScaleSelectorUI() {
    const mapping = useRef<Array<ChordScale>>(DEFAULT_MAPPING);

    return (<></>)
}

// ########### ChordScale ###########
type csProps = {
    readonly name: string;
    readonly baseScale: NoteSet;
    readonly modeNumber: number;
}

function ChordScaleUI({ baseScale, modeNumber, name }: csProps) {
    return (<div className="row">
        <div className="col-md-11">{name}</div>
        <div className="col-md-2">{`${baseScale}`}</div>
        <div className="col-md-11">{`${modeNumber}`}</div>
    </div>)
}