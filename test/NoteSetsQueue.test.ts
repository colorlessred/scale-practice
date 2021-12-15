import { expect } from 'chai';
import { Note } from '../src/musicEngine/Note';
import { NoteSet } from '../src/musicEngine/NoteSet';
import { NoteSetProviderFixed } from '../src/musicEngine/NoteSetProviders';
import { NoteSetsQueue } from '../src/musicEngine/NoteSetsQueue';

describe('NoteSetsQueue', () => {
    it('minimize alterations', () => {
        const noteSetProvider = new NoteSetProviderFixed([NoteSet.Types.MAJOR.transpose(Note.parse('G#'))]);
        const noteSetsQueue = new NoteSetsQueue(2, noteSetProvider);
        const res = NoteSet.Types.MAJOR.transpose(Note.parse('Ab'));
        expect(noteSetsQueue.peek(0).toString()).eq(res.toString());
    });
})