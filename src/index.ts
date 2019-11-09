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
					toLog += `        ${test.expected}\n`;
					toLog += `      ${chalk.grey(`Actual value:`)}\n`;
					toLog += `        ${test.actual}`;
				} else if (test.expected) {
					toLog += `      ${chalk.grey(`Value expected:`)}\n`;
					toLog += `        ${test.expected}\n`;
				} else if (test.actual) {
					toLog += `      ${chalk.grey(`Value:`)}\n`;
					toLog += `        ${test.actual}\n`;
				}
				if (test.actual || test.expected) toLog += `\n\n`;
				if (test.at) toLog += `      at ${chalk.grey(test.at)}\n`;
				toLog += `\n    -----------------------------------------------------------------`;
				toLog += `\n\n`;
			}
		});

		if (passed) console.log(chalk.bgGreen.black` PASS `, block.title);
		else console.log(chalk.bgRed.white` FAIL `, block.title);
		console.log(toLog);
	});
}

function summarize(summary: string[]) {
	summary.forEach(line => {
		if (/^\d+\.\.\.\d+$/.test(line)) return;
		if (/^# not ok$/.test(line))
			console.log(chalk.red.bold`Test Failed`, chalk.red`See above for details.`, `\n`);
		if (/^# ok$/.test(line)) console.log(chalk.green.bold`Test Passed`, `\n`);
		// if (/^# passed: \d+$/) console.log(chalk.``);
	});
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
