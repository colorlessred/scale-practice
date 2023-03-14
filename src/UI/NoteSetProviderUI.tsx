import {ChordMappingGlobal} from "../musicEngine/ChordMappingParser";
import {NoteSetProviderRandomUI} from "./NoteSetProviderRandomUI";
import {NoteSet} from "../musicEngine/NoteSet";
import {IProvider} from "../musicEngine/utilities/IProvider";

type Props = {
    // TODO: modify other props to use React.Dispatch
    setNoteSetProvider: React.Dispatch<IProvider<NoteSet>>;
    chordMappingGlobal: ChordMappingGlobal;
}

/**
 * managed the Provider for the NoteSet and return it to the main UI
 */
export function NoteSetProviderUI({ setNoteSetProvider, chordMappingGlobal }: Props) {

    return (<>
        <label htmlFor="NoteSetProviderUI" className="col-form-label">Scales</label>
        <div className="form-group" id="NoteSetProviderUI">
            <NoteSetProviderRandomUI
                setNoteSetProvider={setNoteSetProvider}
                chordMappingGlobal={chordMappingGlobal}
            />
        </div>
    </>)
}