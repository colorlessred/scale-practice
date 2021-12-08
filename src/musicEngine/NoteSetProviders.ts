import { NoteSet } from "./NoteSet";
import { FixedProvider } from "./utilities/FixedProvider";
import { IProvider } from "./utilities/Provider";
import { RandomProvider } from "./utilities/RandomProvider";

export type INoteSetProvider = IProvider<NoteSet>;

/**
 * cycle over a fixed set of NoteSets
 */
export class NoteSetProviderFixed extends FixedProvider<NoteSet> { }

/**
 * pseudo randomly cycle of a list of NoteSets
 */
export class NoteSetProviderRandom extends RandomProvider<NoteSet> { }
