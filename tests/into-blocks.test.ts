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
					expect(data).toBe(`ok other`);
				},
			};
		};
		const parse = intoBlocks(block);

		parse(`# something`);
		parse(`ok other`);

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
					expect(data).toMatch(/ok other2|ok other/);
				},
				done: () => {},
			};
		};
		const parse = intoBlocks(block);

		parse(`# something\nok other`);
		parse(`ok other2`);

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
					expect(data).toMatch(/^ok other2|ok other$/);
				},
				done: () => {},
			};
		};
		const parse = intoBlocks(block);

		parse(`# something\nok other`);
		parse(`ok other2`);
		parse(`# something\nok other\nok other2`);

		expect(called).toBe(6);
	});

	it(`should respect non-tap logs`, expect => {
		const gatheredLogs: string[] = [];

		const block = (title: string) => {
			expect(title).toBe(`something`);

			return {
				newChunk: () => {},
				logs: (logs: string[]) => gatheredLogs.push(...logs),
				done: () => gatheredLogs.push(`break`),
			};
		};
		const parse = intoBlocks(block);

		parse(`here`);
		parse(`# something\nother`);
		parse(`not ok other2`);
		parse(`there`);
		parse(`# something\nother\nok other2`);
		parse(`1...3`);

		expect(gatheredLogs).toMatchObject([`here`, `break`, `other`, `there`, `break`, `other`]);
	});

	it(`should always call 'done' when a block is finished`, expect => {
		let counter = 0;
		let titles = [`this`, `that`, `then`];

		const block = (title: string) => ({
			newChunk: () => {},
			logs: () => {},
			done: () => {
				expect(titles[counter]).toBe(title);
				counter++;
			},
		});
		const parse = intoBlocks(block);

		parse(`here`);
		parse(`# this\nother`);
		parse(`not ok other2`);
		parse(`there`);
		parse(`# that\nother\nok other2`);
		parse(`# then`);
		parse(`ok here`);
		parse(`1...3`);

		expect(counter).toBe(3);
	});
});
