import { expect } from 'chai';
import { NoteSet } from '../musicEngine/NoteSet';
import { NoteSetChanger } from '../musicEngine/NoteSetChanger'
import { NoteSetProviderFixed } from '../musicEngine/NoteSetProviders';

describe(NoteSetChanger.name, () => {
    const noteSetProvider = new NoteSetProviderFixed([NoteSet.parse('C E G'), NoteSet.parse('D F A')]);
    const nsc = new NoteSetChanger(4, noteSetProvider);

    it('getNoteSetsQueue start', () => { expect(nsc.getNoteSetsQueue().toString()).eq('C E G / D F A') });
    it('nextNotePlayed 1/4', () => { expect(nsc.nextNotePlayed().toString()).eq('C E G / D F A') });
    it('nextNotePlayed 2/4', () => { expect(nsc.nextNotePlayed().toString()).eq('C E G / D F A') });
    it('nextNotePlayed 3/4', () => { expect(nsc.nextNotePlayed().toString()).eq('C E G / D F A') });
    it('nextNotePlayed 4/4', () => { expect(nsc.nextNotePlayed().toString()).eq('D F A / C E G') });
    it('nextNotePlayed 5/4', () => { expect(nsc.nextNotePlayed().toString()).eq('D F A / C E G') });

    it('getNoteSetsQueue end', () => { expect(nsc.getNoteSetsQueue().toString()).eq('D F A / C E G') });

    // changes every two notes
    it('setNotesPerNoteSet', () => { nsc.setNotesPerNoteSet(2); });
    it('setNotesPerNoteSet nextNotePlayed 3/2', () => { expect(nsc.nextNotePlayed().toString()).eq('C E G / D F A') });
    it('setNotesPerNoteSet nextNotePlayed 4/2', () => { expect(nsc.nextNotePlayed().toString()).eq('C E G / D F A') });


});