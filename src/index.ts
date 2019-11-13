import intoBlocks from './into-blocks';
import intoTests from './into-tests';
import parseTest, { Response as TestData } from './parse-test';
import { clearLine, cursorTo } from 'readline';
import chalk from 'chalk';
import { check, times } from './emoji';

type Blocks = { tests: TestData[]; title: string };

function removeRunningMessage() {
	clearLine(process.stdout, 0);
	cursorTo(process.stdout, 0);
}

function showJSONIfGiven(toTest: string | object): string {
	try {
		if (typeof toTest === 'object' && toTest)
			return JSON.stringify(toTest, null, 2).replace(/\n/g, `\n        `);
	} catch (_) {}
	return String(toTest);
}

function writeBlocks(blocks: Blocks[]) {
	blocks.forEach(block => {
		let toLog = ``;
		let passed = true;

		block.tests.forEach(test => {
			if (test.ok) {
				toLog += `  ${chalk.green(check)} ${chalk.gray(test.description)}\n`;
			} else {
				passed = false;
				toLog += `  ${chalk.red(times)} ${chalk.gray(test.description)}\n`;
				toLog += `      ${chalk.red(test.message)}\n\n`;
				if (test.expected && test.actual) {
					toLog += `      ${chalk.grey(`Expected value:`)}\n`;
					toLog += `        ${showJSONIfGiven(test.expected)}\n`;
					toLog += `      ${chalk.grey(`Actual value:`)}\n`;
					toLog += `        ${showJSONIfGiven(test.actual)}`;
				} else if (test.expected) {
					toLog += `      ${chalk.grey(`Value expected:`)}\n`;
					toLog += `        ${test.expected}\n`;
				} else if (test.actual) {
					toLog += `      ${chalk.grey(`Value:`)}\n`;
					toLog += `        ${test.actual}\n`;
				}
				if (test.actual || test.expected) toLog += `\n\n`;
				if (test.at) toLog += `      ${chalk.grey(`at ${test.at}`)}\n`;
				toLog += `\n    ${chalk.grey`-----------------------------------------------------------------`}`;
				toLog += `\n\n`;
			}
		});

		if (passed) console.log(chalk.bgGreen.black` PASS `, block.title);
		else console.log(chalk.bgRed.white` FAIL `, block.title);
		console.log(toLog);
	});
}

function summarize(summary: string[]) {
	const passedMatcher = /^# success: (\d+)$/;
	const failedMatcher = /^# failure: (\d+)$/;
	const planMatcher = /^\d+\.\.\.(\d+)$/;
	let didFail = false;
	let totalTests: string = null;

	summary.forEach(line => {
		if (planMatcher.test(line)) totalTests = line.replace(planMatcher, '$1');
		else if (/^# not ok$/.test(line)) {
			console.log(chalk.red.bold`Failed`, chalk.red`See above for details.`, `\n`);
			didFail = true;
		} else if (/^# ok$/.test(line)) console.log(chalk.green.bold`Passed`, `\n`);
		else if (passedMatcher.test(line) && !didFail)
			console.log(
				chalk.green.bold(line.replace(passedMatcher, '$1')),
				chalk.green`tests passed`
			);
		else if (failedMatcher.test(line) && didFail)
			console.log(
				chalk.red.bold(line.replace(failedMatcher, '$1')),
				chalk.red(`out of ${totalTests} tests failed`)
			);
	});

	if (didFail) {
		console.log();
		console.log(chalk.bgRed.white` RUN FAILURE `, chalk.red`Not ALL of the above tests passed`);
	}

	console.log();
}

function startTest() {
	process.stdout.write(chalk.blue.bold`\n\nRunning tests...`);
}

export default () => {
	startTest();

	const blocks: Blocks[] = [];

	function block(title: string) {
		let block = ``;

		return {
			newChunk: (data: string) => {
				block += `${data}\n`;
			},
			done: () => {
				const rawTests = intoTests(block);

				blocks.push({ tests: rawTests.map(test => parseTest(test)), title });
			},
		};
	}

	const parse = intoBlocks(block, (summary: string[]) => {
		removeRunningMessage();
		writeBlocks(blocks);
		summarize(summary);
	});

	return (chunk: Buffer) => {
		const str = chunk.toString();

		if (str.trim() !== `TAP version 13`) parse(str);
	};
};
