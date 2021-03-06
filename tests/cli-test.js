const { tests, describe } = require('zip-tap');
const delay = require('delay');

console.log(`hi`);

tests(async () => {
	await describe(`createData`, async it => {
		it(`should be a valid type`, expect => {
			expect(1).toBe(1);
		});

		console.log('hello');

		await delay(200);

		it(`should not throw and error when valid params are passed`, expect => {
			expect(1).toBe(1);
		});

		it(`short message`, expect => {
			expect(1).toBe(1);
		});
	});

	console.log('then');

	await delay(300);

	await describe(`divideData`, async it => {
		await it(`should throw an error when invalid params are passed`, async expect => {
			await delay(500);

			expect(1).toBe(1);
		});

		it(`should divide the data`, expect => {
			expect(1).toBe(1);
		});
	});

	describe(`failures`, async it => {
		it(`should pass because this is the first test in this block`, expect => {
			expect(1).toBe(1);
		});

		it(`should fail because I want to see if the fail output`, expect => {
			// expect(1).toBe(2);
		});
		it(`should be a valid type`, expect => {
			expect(1).toBe(1);
		});

		it(`should not throw and error when valied params are passed`, expect => {
			expect(1).toBe(1);
		});

		it(`short message`, expect => {
			expect(1).toBe(1);
		});
	});

	describe(`failures`, async it => {
		it(`should pass because this is the first test in this block`, expect => {
			expect(1).toBe(1);
		});
		it(`should be a valid type`, expect => {
			expect(1).toBe(1);
		});

		it(`should fail because I want to see if the fail output`, expect => {
			// expect(() => {}).toThrow();
		});
		it(`should not throw and error when valied params are passed`, expect => {
			expect(1).toBe(1);
		});

		it(`should show multipule lines here`, expect => {
			expect(`thisthing\nother\nthing`).toBe(1);
		});

		it(`short message`, expect => {
			expect(1).toBe(1);
		});
		it(`should return JSON if failing`, expect => {
			expect([{ this: 'that' }, { then: 'there' }]).toMatchObject([
				{ this: 'that' },
				{ then: 'there' },
			]);
		});
	});
});
