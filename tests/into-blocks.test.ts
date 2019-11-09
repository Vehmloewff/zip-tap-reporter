import { describe } from 'zip-tap';
import intoBlocks from '../src/into-blocks';

describe(`intoBlocks`, it => {
	it(`should return the blocks`, expect => {
		let called = 0;

		const block = (title: string) => {
			called++;

			expect(title).toBe(`something`);

			return {
				newChunk: (data: string) => {
					called++;
					expect(data).toBe(`other`);
				},
			};
		};
		const parse = intoBlocks(block);

		parse(`# something`);
		parse(`other`);

		expect(called).toBe(2);
	});

	it(`should allow calls to be random`, expect => {
		let called = 0;

		const block = (title: string) => {
			called++;

			expect(title).toBe(`something`);

			return {
				newChunk: (data: string) => {
					called++;
					expect(data).toMatch(/other2|other/);
				},
				done: () => {},
			};
		};
		const parse = intoBlocks(block);

		parse(`# something\nother`);
		parse(`other2`);

		expect(called).toBe(3);
	});

	it(`should parse multipule blocks`, expect => {
		let called = 0;

		const block = (title: string) => {
			called++;

			expect(title).toBe(`something`);

			return {
				newChunk: (data: string) => {
					called++;
					expect(data).toMatch(/^other2|other$/);
				},
				done: () => {},
			};
		};
		const parse = intoBlocks(block);

		parse(`# something\nother`);
		parse(`other2`);
		parse(`# something\nother\nother2`);

		expect(called).toBe(6);
	});
});
