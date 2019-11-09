import { syntaxIsConfusing } from './errors';

export default (block: string): string[] => {
	const tests = block.split('\n');
	const isStartOfTest = /(not )?ok/;

	function resolve() {
		for (let key in tests) {
			const test = tests[key];
			const index = Number(key);

			if (!isStartOfTest.test(test)) {
				if (index === 0) throw syntaxIsConfusing;

				tests[index - 1] = `${tests[index - 1]}\n${test}`;
				tests.splice(index, 1);

				resolve();
			}
		}
	}

	resolve();

	return tests;
};
