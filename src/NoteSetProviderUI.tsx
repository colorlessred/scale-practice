import { useEffect, useState } from "react";
import { ALL_NOTES_FLAT_AND_SHARP, Note } from "./musicEngine/Note";
import { NoteSet } from "./musicEngine/NoteSet";
import { INoteSetProvider, NoteSetProviderRandom } from "./musicEngine/NoteSetProviders";
import { SelectorUI } from "./SelectorUI";
import { ScaleTypesUI } from "./ScaleTypesUI";

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
    const [roots, setValidNotes] = useState<Set<Note>>(new Set(ALL_ROOTS));
    const [scales, setValidScales] = useState<Set<NoteSet>>(new Set(ALL_SCALES));

    useEffect(() => {
        const rootsArray: Array<Note> = [...roots.values()];
        const scalesArray: Array<NoteSet> = [...scales.values()];
        const noteSets: Array<NoteSet> = rootsArray.flatMap(root => scalesArray.map(scale => scale.transpose(root)));

        // TODO add fixed provider
        const nsp = new NoteSetProviderRandom(noteSets);
        setNoteSetProvider(nsp);
    }, [roots, scales, setNoteSetProvider]);

    return (<>
        <SelectorUI name="Roots" allValues={ALL_ROOTS} selectedValues={roots}
            setSelectedValues={setValidNotes} getName={note => note.toString()} />
        <SelectorUI name="Scale Types" allValues={ALL_SCALES} selectedValues={scales}
            setSelectedValues={setValidScales} getName={noteSet => noteSet.getName()} />
    </>)
}