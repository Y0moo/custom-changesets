const fs = require('fs-extra');
const path = require('path');

const mainPackageName = 'oh-baby-it-rampage';
const changelogDir = '.changeset';
const otherPackageNames = ['oh-baby-it-tripple', 'oh-baby-it-4'];

async function aggregateReleaseNotes() {
  const changelogFiles = await fs.readdir(changelogDir);

  let mainChangelog = '';
  const otherChangelogs = [];

  for (const file of changelogFiles) {
    if (!file.endsWith('.md')) continue;

    const changelogPath = path.join(changelogDir, file);
    const changelogContent = await fs.readFile(changelogPath, 'utf8');

    if (file.startsWith(mainPackageName)) {
      mainChangelog = changelogContent;
    } else {
      for (const otherPackageName of otherPackageNames) {
        if (file.startsWith(otherPackageName)) {
          otherChangelogs.push(changelogContent);
        }
      }
    }
  }

  if (!mainChangelog) {
    console.error('Main package changelog not found');
    return;
  }

  const aggregatedChangelog =
    mainChangelog +
    '\n\n' +
    otherChangelogs.map((changelog) => `#### ${changelog}`).join('\n\n');

  const mainChangelogPath = path.join(changelogDir, `${mainPackageName}.md`);
  await fs.writeFile(mainChangelogPath, aggregatedChangelog, 'utf8');
  console.log('Aggregated release notes have been generated.');
}

aggregateReleaseNotes().catch((error) => {
  console.error('An error occurred during release notes aggregation:', error);
});
