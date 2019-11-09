import { describe } from 'zip-tap';
import parseTest from '../src/parse-test';

describe(`parseTest`, it => {
	it(`should parse the test`, expect => {
		const str = `ok 5 - something or other`;

		expect(parseTest(str)).toMatchObject({
			ok: true,
			number: 5,
			description: `something or other`,
		});
	});

	it(`should ommit the number if it is not given`, expect => {
		const str = `not ok - something or other`;

		expect(parseTest(str)).toMatchObject({
			ok: false,
			description: `something or other`,
		});
	});

	it(`should add the extras`, expect => {
		let str = `not ok - something or other\n`;
		str += `  ---\n`;
		str += `  at: somestring\n`;
		str += `  message: failed\n`;
		str += `  ...\n`;

		expect(parseTest(str)).toMatchObject({
			ok: false,
			description: `something or other`,
			at: `somestring`,
			message: `failed`,
		});
	});

	it(`should return the right type of extra`, expect => {
		let str = `not ok - something or other\n`;
		str += `  ---\n`;
		str += `  at: somestring\n`;
		str += `  message: failed\n`;
		str += `  actual: something\n`;
		str += `  expected: {"this":"that"}\n`;
		str += `  ...\n`;

		expect(parseTest(str)).toMatchObject({
			ok: false,
			description: `something or other`,
			at: `somestring`,
			message: `failed`,
			actual: `something`,
			expected: {
				this: 'that',
			},
		});
	});
});
