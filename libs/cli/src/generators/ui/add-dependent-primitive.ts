import { prompt } from 'enquirer';
import { getDependentPrimitives } from './primivite-deps';
import type { Primitive } from './primivites';

export const addDependentPrimitives = async (primitivesToCreate: string[], shouldPrompt?: boolean) => {
	const dependentPrimitives = getDependentPrimitives(primitivesToCreate as Primitive[]);

	for await (const primitive of dependentPrimitives) {
		const promptName = `install${primitive.charAt(0).toUpperCase() + primitive.slice(1)}`;
		const installPrimitive = shouldPrompt
			? (
					await prompt({
						type: 'confirm',
						name: promptName,
						initial: true,
						message: `Some of the primitives you are trying to install depend on the ${primitive} primitive. Do you want to add it to your project?`,
					})
				)[promptName]
			: true;
		if (installPrimitive) {
			primitivesToCreate.push(primitive);
		}
	}
};
