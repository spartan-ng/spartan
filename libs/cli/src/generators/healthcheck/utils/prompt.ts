export function promptUser(question: string): Promise<boolean> {
	return new Promise((resolve) => {
		process.stdout.write(`${question} (y/n): `);

		process.stdin.setEncoding('utf8');
		process.stdin.once('data', (data) => {
			const answer = data.toString().trim().toLowerCase();
			if (['yes', 'y'].includes(answer)) {
				resolve(true);
			} else if (['no', 'n'].includes(answer)) {
				resolve(false);
			} else {
				console.log('Invalid response. Please answer with "yes" or "no".');
				resolve(promptUser(question));
			}
		});
	});
}
