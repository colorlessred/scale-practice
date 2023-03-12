import { expect } from 'chai';
import { AutoQueue } from '../musicEngine/utilities/AutoQueue';
import { FixedProvider } from '../musicEngine/utilities/FixedProvider';
import { SecondOrderProvider } from '../musicEngine/utilities/SecondOrderProvider';
import { SecondOrderNoteProvider } from '../musicEngine/SecondOrderNoteProvider';
import { NoteSetProviderFixed } from '../musicEngine/NoteSetProviders';
import {NoteSet, NoteSetTypes} from '../musicEngine/NoteSet';
import { Note } from '../musicEngine/Note';
import { NoteRange } from '../musicEngine/NoteRange';

describe(SecondOrderProvider.name, () => {
    it('fixedProvider', () => {
        const fp1 = [1, 2];
        const fp2 = [3, 4];
        const fp3 = new FixedProvider<Array<number>>([fp1, fp2]);

        const secondOrderProvider = new SecondOrderProvider(fp3, 3, (a, b) => { return new FixedProvider(a); });
        const queue = new AutoQueue(10, secondOrderProvider);
        expect(queue.toString()).eq([1, 2, 1, 3, 4, 3, 1, 2, 1, 3].join(' / '));
    });

    it('currentS', () => {
        const fp1 = [1, 2];
        const fp2 = [3, 4];
        const fp3 = new FixedProvider<Array<number>>([fp1, fp2]);
        const secondOrderProvider = new SecondOrderProvider(fp3, 3, (a, b) => { return new FixedProvider(a); });
        const a = secondOrderProvider.getNext();
        expect(secondOrderProvider.getCurrentS().toString()).eq([1, 2].toString());
    });
});

// describe(SecondOrderNoteProvider.name, () => {
//     it('walk C and C# scales', () => {
//         // C maj and C# maj
//         const noteSetProvider = new NoteSetProviderFixed([NoteSetTypes.MAJOR, NoteSetTypes.MAJOR.transpose(Note.parse('C#'))]);
//         const range = new NoteRange(new Note(0, 0), new Note(6, 0));
//         const secondOrderNoteProvider = new SecondOrderNoteProvider(noteSetProvider, 4, range, new Note(1, 0));
//         const queue = new AutoQueue<Note>(10, secondOrderNoteProvider);
//         expect(queue.toString()).eq([
//             'D', 'E', 'F', 'G', // switch
//             'G#', 'A#', 'G#', 'F#', // switch
//             'F', 'E'].join(' / '));
//     });
// });