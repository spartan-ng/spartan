import { formatFiles, type Tree } from '@nx/devkit';
import { execSync } from 'node:child_process';

export default async function updateContributorsGenerator(tree: Tree): Promise<void> {
	try {
		const contributorsWithUsernames = new Set<string>();

		// Extract GitHub usernames from git commit history
		// Method 1: Extract from GitHub noreply email addresses (username@users.noreply.github.com)
		try {
			const gitLog = execSync('git log --format="%ae"', { encoding: 'utf-8' });
			gitLog.split('\n').forEach((email) => {
				const match = email.match(/^(\d+\+)?([a-zA-Z0-9][\w-]*?)@users\.noreply\.github\.com$/);
				if (match && match[2]) {
					contributorsWithUsernames.add(match[2]);
				}
			});
		} catch (error) {
			console.warn('Could not extract usernames from git log emails');
		}

		// Method 2: Extract from Co-authored-by and Signed-off-by trailers
		try {
			const gitTrailers = execSync(
				'git log --format="%(trailers:key=Co-authored-by,valueonly)%n%(trailers:key=Signed-off-by,valueonly)"',
				{ encoding: 'utf-8' },
			);
			gitTrailers.split('\n').forEach((line) => {
				// Match: Name <username@users.noreply.github.com> or Name <number+username@users.noreply.github.com>
				const match = line.match(/<(?:\d+\+)?([a-zA-Z0-9][\w-]*?)@users\.noreply\.github\.com>/);
				if (match && match[1]) {
					contributorsWithUsernames.add(match[1]);
				}
			});
		} catch (error) {
			console.warn('Could not extract usernames from git trailers');
		}

		// Method 3: Try to get contributors from GitHub API using gh CLI as supplementary (optional)
		try {
			const ghContributors = execSync('gh api repos/:owner/:repo/contributors --paginate --jq ".[].login"', {
				encoding: 'utf-8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});
			ghContributors
				.split('\n')
				.filter(Boolean)
				.forEach((username) => contributorsWithUsernames.add(username.trim()));
			console.log('✓ Enhanced with GitHub API data');
		} catch {
			console.log('ℹ Using git history only (GitHub CLI not available - this is fine!)');
		}

		if (contributorsWithUsernames.size === 0) {
			console.log('No contributors found. Make sure you have git history available.');
			return;
		}

		console.log(`Found ${contributorsWithUsernames.size} total unique contributor(s) in git history`);

		// Read the README
		const readmePath = 'README.md';
		let readmeContent = tree.read(readmePath, 'utf-8');
		if (!readmeContent) {
			console.error('README.md not found');
			return;
		}

		// Read the three-hundred.ts file
		const threeHundredPath = 'apps/app/src/app/pages/(home)/components/three-hundred.ts';
		let threeHundredContent = tree.read(threeHundredPath, 'utf-8');
		if (!threeHundredContent) {
			console.warn('three-hundred.ts not found, will only update README');
		}

		// Find the contributors section in README
		const contributorsMatch = readmeContent.match(
			/## The 300 spartans[\s\S]*?(\d+)\.\s*\[([\w-]+)\]\(https:\/\/(?:www\.)?github\.com\/([\w-]+)\)/g,
		);

		if (!contributorsMatch) {
			console.error('Could not find contributors section in README');
			return;
		}

		// Extract existing contributors from both files
		const existingContributors = new Set<string>();

		// From README
		const contributorPattern = /\[([\w-]+)\]\(https:\/\/(?:www\.)?github\.com\/([\w-]+)\)/g;
		let match;
		while ((match = contributorPattern.exec(readmeContent)) !== null) {
			existingContributors.add(match[2].toLowerCase());
		}

		// From three-hundred.ts
		if (threeHundredContent) {
			const tsContributorPattern = /'([\w-]+)'/g;
			const arrayMatch = threeHundredContent.match(/protected readonly _contributors = \[([\s\S]*?)\];/);
			if (arrayMatch) {
				let tsMatch;
				while ((tsMatch = tsContributorPattern.exec(arrayMatch[1])) !== null) {
					existingContributors.add(tsMatch[1].toLowerCase());
				}
			}
		}

		// Find the last contributor number
		const lastNumberMatch = readmeContent.match(/(\d+)\.\s*\[[\w-]+\]\(https:\/\/(?:www\.)?github\.com\//g);
		let lastNumber = 0;
		if (lastNumberMatch) {
			const numbers = lastNumberMatch.map((m) => parseInt(m.match(/(\d+)/)?.[1] || '0', 10));
			lastNumber = Math.max(...numbers);
		}

		// Filter out contributors who are already in the README
		const newContributors = Array.from(contributorsWithUsernames)
			.filter((username) => !existingContributors.has(username.toLowerCase()))
			.sort();

		if (newContributors.length === 0) {
			console.log('No new contributors to add. All contributors are already in the README.');
			return;
		}

		console.log(`Found ${newContributors.length} new contributor(s) to add:`);
		newContributors.forEach((username) => console.log(`  - ${username}`));

		// Find the insertion point (after the last contributor)
		const lastContributorPattern = new RegExp(
			`(${lastNumber}\\.\\s*\\[[\\w-]+\\]\\(https:\\/\\/(?:www\\.)?github\\.com\\/[\\w-]+\\))`,
		);
		const insertionMatch = lastContributorPattern.exec(readmeContent);

		if (!insertionMatch) {
			console.error('Could not find insertion point in README');
			return;
		}

		// Build the new contributors text
		const newContributorsText = newContributors
			.map((username, index) => {
				const number = lastNumber + index + 1;
				return `${number}. [${username}](https://github.com/${username})`;
			})
			.join('\n');

		// Insert the new contributors after the last existing contributor
		const insertionIndex = insertionMatch.index + insertionMatch[0].length;
		readmeContent =
			readmeContent.slice(0, insertionIndex) + '\n' + newContributorsText + readmeContent.slice(insertionIndex);

		// Update the README
		tree.write(readmePath, readmeContent);

		// Update the three-hundred.ts file if it exists
		if (threeHundredContent) {
			// Find the _contributors array
			const arrayPattern = /(protected readonly _contributors = \[)([\s\S]*?)(\];)/;
			const arrayMatch = arrayPattern.exec(threeHundredContent);

			if (arrayMatch) {
				// Get the existing contributors from the array
				const existingTsContributors = arrayMatch[2]
					.split(',')
					.map((c) => c.trim().replace(/'/g, ''))
					.filter(Boolean);

				// Add new contributors to the array
				const updatedContributors = [...existingTsContributors, ...newContributors];

				// Format the array with proper indentation
				const formattedContributors = updatedContributors.map((c) => `\t\t'${c}'`).join(',\n');

				// Replace the array content
				threeHundredContent = threeHundredContent.replace(arrayPattern, `$1\n${formattedContributors},\n\t$3`);

				tree.write(threeHundredPath, threeHundredContent);
				console.log(`Updated three-hundred.ts with ${newContributors.length} new contributor(s)`);
			} else {
				console.warn('Could not find _contributors array in three-hundred.ts');
			}
		}

		await formatFiles(tree);

		console.log(`\nSuccessfully added ${newContributors.length} new contributor(s) to the README.`);
	} catch (error) {
		console.error('Error updating contributors:', error);
		throw error;
	}
}
