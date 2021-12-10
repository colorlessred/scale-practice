import { expect } from 'chai';
import { ChordMapping, ChordMappingGlobal } from '../src/musicEngine/ChordMappingParser';

describe(ChordMapping.name, () => {
    function test(line: string, result: string) {
        it(line, () => {
            expect(ChordMapping.parse(line).noteSetMode.toString()).eq(result);
        })
    }

    test('7+: mode 1 of Major', 'C D E F G A B');
    test('7: mode 5 of Major', 'C D E F G A Bb');
    test('m7b5: mode 7 of Major', 'C Db Eb F Gb Ab Bb');
    test(' 7+:  mode 1  of  Major ', 'C D E F G A B');
    test(' 7+:  mode 1  of  Major ', 'C D E F G A B');


    function testError(line: string, message: RegExp) {
        it(line, () => {
            expect(() => { ChordMapping.parse(line) }).throw(Error, message);
        })
    }

    testError('7+ mode 1 of Major', /cannot parse line/);
    testError('7+: mode 1 of abcd', /NoteSet not found/);

    it('toString', () => { expect(ChordMapping.parse(' 7+:  mode 1  of  Major ').toString()).eq('7+: mode 1 of Major'); });
});

describe(ChordMappingGlobal.name, () => {
    it('two lines', () => {
        expect(ChordMappingGlobal.parse(`7+: mode 1 of Major
7: mode 4 of Melodic Minor`).mappings[1].noteSetMode.toString()).eq('C D E F# G A Bb')
    });

    it('toString(), two lines', () => {
        expect(ChordMappingGlobal.parse(`7+:  mode 1 of Major   
  7: mode 4 of Melodic Minor`).toString())
            .eq(`7+: mode 1 of Major
7: mode 4 of Melodic Minor`)
    });

});

