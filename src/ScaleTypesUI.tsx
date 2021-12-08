import React from "react";
import { NoteSet } from "./musicEngine/NoteSet";

const ALL_SCALES = [NoteSet.Types.MAJOR, NoteSet.Types.MELODIC_MINOR];

type Props = {
    allScales: Array<NoteSet>;
    validScales: Set<NoteSet>;
    setValidScales: React.Dispatch<Set<NoteSet>>;
}

export function ScaleTypesUI({ allScales, setValidScales, validScales }: Props) {
    return (
        <></>
    )
}