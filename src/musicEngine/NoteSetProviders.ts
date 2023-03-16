import {NoteSet} from "./NoteSet";
import {FixedProvider} from "./utilities/FixedProvider";
import {RandomProvider} from "./utilities/RandomProvider";

/**
 * cycle over a fixed set of NoteSets
 */
export class NoteSetProviderFixed extends FixedProvider<NoteSet> { }

/**
 * pseudo randomly cycle of a list of NoteSets
 */
export class NoteSetProviderRandom extends RandomProvider<NoteSet> { }
