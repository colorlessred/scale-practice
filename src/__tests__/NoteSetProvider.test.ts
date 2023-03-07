import { expect } from 'chai';
import { NoteSet } from '../musicEngine/NoteSet';
import { NoteSetProviderFixed } from '../musicEngine/NoteSetProviders'

describe(NoteSetProviderFixed.name, () => {
    const nsp = new NoteSetProviderFixed([NoteSet.parse('C E G'), NoteSet.parse('D F A')]);

    describe('getNext', () => {
        it('first', () => { expect(nsp.getNext().toString()).eq('C E G') });
        it('second', () => { expect(nsp.getNext().toString()).eq('D F A') });
        it('third', () => { expect(nsp.getNext().toString()).eq('C E G') });
    });
});