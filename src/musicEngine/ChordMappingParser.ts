import { Note } from "./Note";
import { NoteSet } from "./NoteSet";

/**
 * map a full text into a Set of Chord -> NoteSets
 */
export class ChordMappingGlobal {
    readonly mappings: Array<ChordMapping>;

    constructor(mappings: Array<ChordMapping>) {
        this.mappings = mappings.slice();
    }

    static parse(text: string): ChordMappingGlobal {
        const mappings: Array<ChordMapping> = text
            .split(ChordMappingGlobal.regex)
            .map((line: string) => { return ChordMapping.parse(line) });

        return new ChordMappingGlobal(mappings);
    }

    static readonly regex = /\n/
}

/**
 * parse single line into chord mapping
 * 7: mode 5 of Major
 * @param line 
 */
export class ChordMapping {
    readonly name: string;
    readonly mode: number;
    readonly baseNoteSet: NoteSet;
    /** the computed NoteSet */
    readonly noteSetMode: NoteSet;

    constructor(name: string, modeNumber: number, baseNoteSet: NoteSet, noteSetMode: NoteSet) {
        this.name = name;
        this.mode = modeNumber;
        this.baseNoteSet = baseNoteSet;
        this.noteSetMode = noteSetMode;
    }

    static parse(line: string): ChordMapping {
        const res = ChordMapping.regex.exec(line);
        if (!res) {
            throw new Error(`cannot parse line "${line}"`);
        }

        const [_, name, mode, baseNoteSetName] = res;
        const baseNoteSet = NoteSet.Types.ALL.get(baseNoteSetName.trim());

        if (!baseNoteSet) {
            throw new Error(`NoteSet not found: "${baseNoteSetName}"`);
        }

        // is number, guaranteed by the regex
        const modeNumber = parseInt(mode);

        const noteSetMode = baseNoteSet.getMode(modeNumber);

        return new ChordMapping(name, modeNumber, baseNoteSet, noteSetMode);
    }

    static readonly regex = /^\s*(.*?):\s+mode\s+(\d+)\s+of\s+([\w\s]+)/
}