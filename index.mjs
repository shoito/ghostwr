import {
	Configuration,
	OpenAIApi
} from 'openai';

const configuration = new Configuration({
	organization: process.env.ORGANIZATION_ID,
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const model = 'text-davinci-003';
// size: short, medium, long
// kind: article, slide
const [title, size, kind] = process.argv.slice(2);

if (kind === 'slide') {
	console.log(`---
marp: true
headingDivider: 4
---\n`)
}

console.log(`# ${title}`);
const tocRaw = (await openai.createCompletion({
	prompt: `「${title}」の目次を書いてください`,
	model,
	max_tokens: size === 'short' ? 512 : size === 'medium' ? 1024 : 2048,
	n: 1,
	temperature: 0.6,
})).data.choices[0].text;

console.log(`${tocRaw}\n\n`);

const toc = tocRaw.split('\n').filter((line) => line !== '').map((line) => {
	const level = line.split('  ').length - 1;
	const contentTitle = line.trim().replace(/^- /, '');
	return { level, contentTitle };
});

const MIN_CONTENT_TITLE_LENGTH = 8;
const contentTitleList = [];
let preContentTitle = ''
let currentLevel = 0;
for (const { level, contentTitle } of toc) {
	if (level > currentLevel) {
		currentLevel = level;
		contentTitleList.push(preContentTitle);
	} else if (level < currentLevel) {
		currentLevel = level;
		contentTitleList.pop();
	}

	let promptKeyword = `${contentTitleList.join(' ')} ${contentTitle}`
	if (level === 0 && contentTitle.length < MIN_CONTENT_TITLE_LENGTH) {
		promptKeyword = `${title} ${contentTitle}`
	}

	let promptSuffix = 'の記事を書いてください';
	if (kind === 'slide') {
		promptSuffix = 'の解説を箇条書きで要約してください';
	}

	console.log(`${'#'.repeat(level + 2)} ${contentTitle}`);
	const contentRaw = (await openai.createCompletion({
		prompt: `「${promptKeyword}」${promptSuffix}`,
		model,
		max_tokens: size === 'short' ? 1024 : size === 'medium' ? 2048 : 4096,
		n: 1,
		temperature: 0.6,
	})).data.choices[0].text;
	console.log(`${contentRaw}\n`);

	preContentTitle = contentTitle;
}