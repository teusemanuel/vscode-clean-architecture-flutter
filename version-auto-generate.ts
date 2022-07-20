const { gitDescribeSync } = require('git-describe');
const { glob } = require('glob');
const { writeFileSync, readFileSync } = require('fs-extra');

const gitInfo = gitDescribeSync({
	dirtyMark: false,
	dirtySemver: false,
	match: '*',
});

(async () => {
	glob('./*/package.json', (err: Error, filesPath: string[]) => {
		if (err) {
			console.log(err);
		}
		if (!filesPath?.length) {
			filesPath = [];
		}
		filesPath = [...filesPath, 'package.json']; // add root package.json
		for (const filePath of filesPath) {
			const fileData = readFileSync(filePath);
			const file = JSON.parse(fileData);
			file.version = gitInfo.tag;
			let data = JSON.stringify(file, null, '\t');
			writeFileSync(filePath, data);
			console.log(`Wrote version info ${gitInfo.tag} to ${filePath}`);
		}
	});
})();
