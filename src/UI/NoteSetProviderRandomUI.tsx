import React, {useEffect, useState} from "react";
import {ChordMappingGlobal} from "../musicEngine/ChordMappingParser";
import {ALL_NOTES_FLAT_AND_SHARP, Note} from "../musicEngine/Note";
import {NoteSet} from "../musicEngine/NoteSet";
import {NoteSetProviderRandom} from "../musicEngine/NoteSetProviders";
import {SelectorUI} from "./SelectorUI";
import {IProvider} from "../musicEngine/utilities/IProvider";

type Props = {
    // TODO: modify other props to use React.Dispatch
    setNoteSetProvider: React.Dispatch<IProvider<NoteSet>>;
    chordMappingGlobal: ChordMappingGlobal;
}

/**
 * init to all true
 */
const ALL_ROOTS: Array<Note> = ALL_NOTES_FLAT_AND_SHARP.slice();

/**
 * managed the Provider for the NoteSet and return it to the main UI
 */
export function NoteSetProviderRandomUI({setNoteSetProvider, chordMappingGlobal}: Props) {
    const [roots, setRoots] = useState<Set<Note>>(new Set(ALL_ROOTS));
    const [scales, setScales] = useState<Set<NoteSet>>(new Set<NoteSet>(chordMappingGlobal.allNoteSets));

    if (scales.size === 0) {
        throw new Error('Cannot set up NoteSetProviderRandomUI without some NoteSets');
    }

    useEffect(() => {
        console.log(`chordMappingGlobal: ${chordMappingGlobal}`);
    }, [chordMappingGlobal]);

    useEffect(() => {
        const rootsArray: Array<Note> = [...roots.values()];
        const scalesArray: Array<NoteSet> = [...scales.values()];
        const noteSets: Array<NoteSet> = rootsArray.flatMap(root => scalesArray.map(scale => scale.transpose(root).minimizeAlterations()));

        const nsp = new NoteSetProviderRandom(noteSets);
        setNoteSetProvider(nsp);
    }, [roots, scales, setNoteSetProvider]);

    // re-select all scales when the chord mapping changes
    useEffect(() => {
        setScales(new Set<NoteSet>(chordMappingGlobal.allNoteSets));
    }, [chordMappingGlobal]);

    return (<>
            <label htmlFor="NoteSetProviderRandomUI" className="col-form-label">Random</label>
            <div className="form-group" id="NoteSetProviderRandomUI">
                <SelectorUI name="Roots" allValues={ALL_ROOTS} selectedValues={roots}
                            setSelectedValues={setRoots} getName={note => note.toString()}/>
                <SelectorUI name="Scale Types"
                            allValues={chordMappingGlobal.allNoteSets}
                            selectedValues={scales} setSelectedValues={setScales}
                            getName={noteSet => noteSet.getName()}/>
            </div>
        </>
    );
}