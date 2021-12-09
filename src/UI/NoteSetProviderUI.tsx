import { useEffect, useState } from "react";
import { ALL_NOTES_FLAT_AND_SHARP, Note } from "../musicEngine/Note";
import { NoteSet } from "../musicEngine/NoteSet";
import { INoteSetProvider, NoteSetProviderRandom } from "../musicEngine/NoteSetProviders";
import { SelectorUI } from "./SelectorUI";
import { ScaleTypesUI } from "./ScaleTypesUI";
import { NoteSetProviderRandomUI } from "./NoteSetProviderRandomUI";

type Props = {
    noteSetProvider: INoteSetProvider;
    // TODO: modify other props to use React.Dispatch
    setNoteSetProvider: React.Dispatch<INoteSetProvider>;
}

/**
 * init to all true
 */
const ALL_ROOTS: Array<Note> = ALL_NOTES_FLAT_AND_SHARP.slice();
const ALL_SCALES: Array<NoteSet> = [NoteSet.Types.MAJOR, NoteSet.Types.MELODIC_MINOR];

/**
 * managed the Provider for the NoteSet and return it to the main UI
 */
export function NoteSetProviderUI({ noteSetProvider, setNoteSetProvider }: Props) {

    return (<>
        <label htmlFor="NoteSetProviderUI" className="col-form-label">Scales</label>
        <div className="form-group" id="NoteSetProviderUI">
            <NoteSetProviderRandomUI noteSetProvider={noteSetProvider} setNoteSetProvider={setNoteSetProvider} />
        </div>
    </>)
}