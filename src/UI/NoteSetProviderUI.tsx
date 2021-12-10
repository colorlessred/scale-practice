import { ChordMappingGlobal } from "../musicEngine/ChordMappingParser";
import { INoteSetProvider } from "../musicEngine/NoteSetProviders";
import { NoteSetProviderRandomUI } from "./NoteSetProviderRandomUI";

type Props = {
    noteSetProvider: INoteSetProvider;
    // TODO: modify other props to use React.Dispatch
    setNoteSetProvider: React.Dispatch<INoteSetProvider>;
    chordMappingGlobal: ChordMappingGlobal;
}

/**
 * managed the Provider for the NoteSet and return it to the main UI
 */
export function NoteSetProviderUI({ noteSetProvider, setNoteSetProvider, chordMappingGlobal }: Props) {

    return (<>
        <label htmlFor="NoteSetProviderUI" className="col-form-label">Scales</label>
        <div className="form-group" id="NoteSetProviderUI">
            <NoteSetProviderRandomUI
                noteSetProvider={noteSetProvider}
                setNoteSetProvider={setNoteSetProvider}
                chordMappingGlobal={chordMappingGlobal}
            />
        </div>
    </>)
}