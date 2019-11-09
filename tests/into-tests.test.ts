import { describe } from 'zip-tap';
import intoTests from '../src/into-tests';

describe(`intoTests`, it => {
	it(`should break blocks up into tests`, expect => {
		const t2 = `not ok 2 - something
  ---
  actual: me
  expected: you
  at: us
  message: them
  ...`;

		expect(intoTests(`ok 1 - des\n${t2}\nok 3 - us`)).toMatchObject([
			`ok 1 - des`,
			t2,
			`ok 3 - us`,
		]);
	});

	it(`should break blocks up into tests simply`, expect => {
		const t = `ok 2 - something sd
ok 3 - other s
ok 4 - other2`;

		expect(intoTests(t)).toMatchObject([
			`ok 2 - something sd`,
			`ok 3 - other s`,
			`ok 4 - other2`,
		]);
	});
});
