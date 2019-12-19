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
				done: (logs: string[]) => gatheredLogs.push(...logs, `break`),
			};
		};
		const parse = intoBlocks(block);

		parse(`here`);
		parse(`# something\nother`);
		parse(`not ok other2`);
		parse(`there`);
		parse(`# something\nother\nok other2`);
		parse(`1...3`);
		parse(`success: 2`);
		parse(`failure: 0`);

		expect(gatheredLogs).toMatchObject([`here`, `other`, `there`, `break`, `other`, `break`]);
	});

	it(`should always call 'done' when a block is finished`, expect => {
		let counter = 0;
		let titles = [`this`, `that`, `then`];

		const block = (title: string) => ({
			newChunk: () => {},
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

	it(`should work with a live example`, expect => {
		let counter = 0;
		let expectedLogs = [[], [], [`hi`]];

		const block = () => ({
			newChunk: () => {},
			done: (logs: string[]) => {
				expect(logs).toMatchObject(expectedLogs[counter]);
				counter++;
			},
		});
		const parse = intoBlocks(block);

		parse(`TAP version 13`);
		parse(`# stores`);
		parse(`ok 1 - should update and call the subscribers`);
		parse(`ok 2 - should unsubscribe themselves when prompted to do so`);
		parse(`ok 3 - readable stores should update themselves accoring to the second param`);
		parse(`ok 4 - dependant stores should update when the dependents do`);
		parse(`# something`);
		parse(`ok 5 - should pass`);
		parse(`# createEventDispatcher`);
		parse(`ok 6 - should call the listeners when new events are recieved`);
		parse(`hi`);
		parse(`not ok 7 - should only call the 'once' events once`);
		parse(`  ---`);
		parse(`  message: The expected value did not match the actual`);
		parse(`  operator: toBe`);
		parse(`  at: toBe(/home/vehmloewff/Code/versatilejs/dist/build.js:3854:48)`);
		parse(`  expected: 2`);
		parse(`  actual: 3`);
		parse(`  ...`);
		parse(`1...7`);
		parse(``);
		parse(`# not ok`);
		parse(`# success: 6`);
		parse(`# failure: 1`);
	});

	it(`should bail out when asked to`, expect => {
		const gatheredLogs: string[] = [];

		const block = (title: string) => {
			expect(title).toBe(`something`);

			return {
				newChunk: () => {},
				done: (logs: string[]) => gatheredLogs.push(...logs, `break`),
			};
		};
		const parse = intoBlocks(block);

		parse(`here`);
		parse(`# something\nother`);
		parse(`not ok other2`);
		parse(`there`);
		parse(`Bail out!`);
		parse(`other\nok other2`);
		parse(`at mewrtew`);
		parse(`at 8234751h`);
		parse(`Error!`);

		expect(gatheredLogs).toMatchObject([`here`, `other`, `there`, `break`]);
	});
});
