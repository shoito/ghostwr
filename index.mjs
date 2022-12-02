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
const [title, size] = process.argv.slice(2); // size: short, medium, long

console.log(`# ${title}`);
const tocRaw = (await openai.createCompletion({
	prompt: `${title}の目次を書いてください`,
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

let preContentTitle = ''
let currentLevel = 0;
const contentTitleList = [];
for (const { level, contentTitle } of toc) {
	if (level > currentLevel) {
		currentLevel = level;
		contentTitleList.push(preContentTitle);
	} else if (level < currentLevel) {
		currentLevel = level;
		contentTitleList.pop();
	}

	console.log(`${'#'.repeat(level + 2)} ${contentTitle}`);
	const contentRaw = (await openai.createCompletion({
		prompt: `「${contentTitleList.join(' ')} ${contentTitle}」の記事を書いてください`,
		model,
		max_tokens: size === 'short' ? 1024 : size === 'medium' ? 2048 : 4096,
		n: 1,
		temperature: 0.6,
	})).data.choices[0].text;
	console.log(`${contentRaw}\n`);

	preContentTitle = contentTitle;
}