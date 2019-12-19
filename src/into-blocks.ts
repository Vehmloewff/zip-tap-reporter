export type Caller = (title: string) => CallerResult;
export type CallerResult = {
	newChunk: (data: string) => void;
	done?: (logs: string[]) => void;
};

export default function intoBlocks(
	caller: Caller,
	done?: (data: string[]) => void
): (data: string) => void {
	let currentCaller: CallerResult = null;
	const blockStart = /^#\s+.*$/;
	const blockStartHash = /^#\s+/;
	const testSummaryStart = /^\d+\.\.\.\d+$/;
	const testEnd = /^# failure: \d+/;
	const bailOut = /^Bail out\!$/;

	const removeEmpty = (d: string) => d !== '';

	let onSummary = false;
	let bailed = false;
	let summary: string[] = [];

	let logs: string[] = [];

	const callDone = () => {
		if (currentCaller && currentCaller.done) {
			currentCaller.done(logs);
			logs = [];
		} else if (bailed) {
			console.log();
			console.log();
			console.log(logs.join('\n'));
			console.log();
			logs = [];
		}
	};

	let inYML = false;
	const isTAPData = (data: string) => {
		if (/^  ---$/.test(data)) {
			inYML = true;
			return true;
		}
		if (/^  \.\.\.$/.test(data)) {
			inYML = false;
			return true;
		}
		if (inYML) return true;
		else return /^(not )?ok/.test(data);
	};

	const parse = (data: string) => {
		if (bailed) return;
		const arrData = data.split('\n').filter(removeEmpty);

		arrData.filter(removeEmpty).forEach(data => {
			if (bailOut.test(data)) {
				bailed = true;
				callDone();
			} else if (testSummaryStart.test(data)) {
				callDone();
				onSummary = true;
				summary.push(data);
			} else if (onSummary && testEnd.test(data)) {
				summary.push(data);
				if (done) done(summary.filter(d => d !== ''));
			} else if (onSummary) {
				summary.push(data);
			} else if (blockStart.test(data)) {
				callDone();
				currentCaller = caller(data.replace(blockStartHash, ''));
			} else {
				if (data.match(/^TAP version 13$/)) return;
				if (!isTAPData(data)) return logs.push(data);
				if (!currentCaller) currentCaller = caller(`tests`);

				currentCaller.newChunk(data);
			}
		});
	};

	return parse;
}
