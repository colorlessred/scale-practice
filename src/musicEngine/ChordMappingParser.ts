import { NoteSet } from "./NoteSet";

/**
 * map a full text into a Set of Chord -> NoteSets
 */
export class ChordMappingGlobal {
    readonly mappings: Array<ChordMapping>;
    readonly allNoteSets: Array<NoteSet>;

    constructor(mappings: Array<ChordMapping>) {
        this.mappings = mappings.slice();
        this.allNoteSets = mappings.map(a => a.noteSetMode);
    }

    toString(): string {
        return this.mappings.map(chordMapping => chordMapping.toString()).join('\n');
    }

    static parse(text: string): ChordMappingGlobal {
        const mappings: Array<ChordMapping> = text
            .split(ChordMappingGlobal.regex)
            .map((line: string) => { return ChordMapping.parse(line) });

        return new ChordMappingGlobal(mappings);
    }

    static readonly regex = /\n/;

    public static readonly EMPTY_MAPPING: ChordMappingGlobal = new ChordMappingGlobal(new Array<ChordMapping>());
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

    toString(): string {
        return `${this.name}: mode ${this.mode} of ${this.baseNoteSet.getName()}`;
    }

    static parse(line: string): ChordMapping {
        const res = ChordMapping.regex.exec(line);
        if (!res) {
            throw new Error(`cannot parse line "${line}"`);
        }

        const [name, mode, baseNoteSetName] = res.slice(1);
        const baseNoteSet = NoteSet.Types.ALL.get(baseNoteSetName.trim());

        if (!baseNoteSet) {
            throw new Error(`NoteSet not found: "${baseNoteSetName}"`);
        }

        // is number, guaranteed by the regex
        const modeNumber = parseInt(mode);

        const noteSetMode = baseNoteSet.getMode(modeNumber, name);

        return new ChordMapping(name, modeNumber, baseNoteSet, noteSetMode);
    }

    static readonly regex = /^\s*(.*?):\s+mode\s+(\d+)\s+of\s+([\w\s]+)/
}