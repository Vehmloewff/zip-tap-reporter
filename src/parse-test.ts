import jsYaml from 'js-yaml';

type Extra = {
	actual?: string | object;
	expected?: string | object;
	at?: string;
	message?: string;
};

export type Response = Extra & {
	ok: boolean;
	description: string;
	number?: number;
};

export default (data: string): Response => {
	const isOk = /^ok/;
	const extractions = /^(not )?ok (\d*) ?\- (.+)(\s|.)*$/;

	let response: Response = {
		ok: isOk.test(data),
		description: data.replace(extractions, '$3'),
	};

	const number = Number(data.replace(extractions, '$2'));
	const extra = getExtra(data);

	if (number) response.number = number;
	if (extra) response = { ...response, ...parseExtra(extra) };

	return response;
};

function parseExtra(extraData: string): Extra {
	const extra = jsYaml.safeLoad(extraData.replace(/  \-\-\-\n|\n  \.\.\.|/g, ''));

	if (Array.isArray(extra.actual)) extra.actual = extra.actual.join('\n');
	if (Array.isArray(extra.expected)) extra.expected = extra.expected.join('\n');

	if (extra.actual) extra.actual = stringMightBeObject(extra.actual);
	if (extra.expected) extra.expected = stringMightBeObject(extra.expected);

	return extra;
}

function stringMightBeObject(str: string | object): string | object {
	if (typeof str === 'object') return str;
	try {
		return JSON.parse(str);
	} catch (_) {
		return str;
	}
}

function getExtra(data: string): string {
	const arr = data.match(/  \-\-\-(\n)(.+\n)+  \.\.\./);

	if (!arr) return null;

	return arr[0];
}
