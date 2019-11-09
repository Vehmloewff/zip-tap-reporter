import { mustStartWithComment } from './errors';

export type Caller = (title: string) => CallerResult;
export type CallerResult = { newChunk: (data: string) => void; done?: () => void };

export default function intoBlocks(
	caller: Caller,
	done?: (data: string[]) => void
): (data: string) => void {
	let currentCaller: CallerResult = null;
	const blockStart = /^#\s+.*$/;
	const blockStartHash = /^#\s+/;
	const testSummaryStart = /^\d+\.\.\.\d+$/;
	const testEnd = /^# failure: \d+/;

	const removeEmpty = (d: string) => d !== '';

	let onSummary = false;
	let summary: string[] = [];

	const parse = (data: string) => {
		const arrData = data.split('\n').filter(removeEmpty);

		arrData.filter(removeEmpty).forEach(data => {
			if (testSummaryStart.test(data)) {
				currentCaller.done();
				onSummary = true;
				summary.push(data);
			} else if (onSummary && testEnd.test(data)) {
				summary.push(data);
				if (done) done(summary.filter(d => d !== ''));
			} else if (onSummary) {
				summary.push(data);
			} else if (blockStart.test(data)) {
				if (currentCaller && currentCaller.done) currentCaller.done();
				currentCaller = caller(data.replace(blockStartHash, ''));
			} else {
				if (data.match(/TAP version 13/)) return;
				if (!currentCaller) throw mustStartWithComment;

				currentCaller.newChunk(data);
			}
		});
	};

	return parse;
}
