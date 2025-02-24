import { Tree } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';

export function hasHelmClasses(tree: Tree, path: string, { component, classes }: HasHelmClassesSchema): boolean {
	const content = tree.read(path, 'utf-8');

	if (!content) {
		return false;
	}

	const ast = tsquery.ast(content);

	// find the component class if it exists
	const componentClass = tsquery.query(ast, `ClassDeclaration:has(Identifier[name="${component}"])`);

	if (componentClass.length === 0) {
		return false;
	}

	// try and find the _computedClass property string
	const computedClass = tsquery.query(
		componentClass[0],
		`PropertyDeclaration:has(Identifier[name="_computedClass"]) CallExpression CallExpression:has(Identifier[name="hlm"]) StringLiteral`,
	);

	if (computedClass.length === 0) {
		return false;
	}

	// get the computed class value
	const classesString = computedClass[0].getText();
	const classesArray = classesString.split(' ');

	// check if the classes exist
	return classes.some((c) => classesArray.includes(c));
}

interface HasHelmClassesSchema {
	/**
	 * The name of the components that need to be checked.
	 */
	component: string;
	/**
	 * The classes that need to be checked for.
	 */
	classes: string[];
}

export function updateHelmClasses(
	tree: Tree,
	path: string,
	{ component, classesToAdd, classesToRemove }: UpdateHelmClassesSchema,
): string {
	const content = tree.read(path, 'utf-8');

	if (!content) {
		return;
	}

	const ast = tsquery.ast(content);

	// find the component class if it exists
	const componentClass = tsquery.query(ast, `ClassDeclaration:has(Identifier[name="${component}"])`);

	if (componentClass.length === 0) {
		return;
	}

	// try and find the _computedClass property string
	const computedClass = tsquery.query(
		componentClass[0],
		`PropertyDeclaration:has(Identifier[name="_computedClass"]) CallExpression CallExpression:has(Identifier[name="hlm"]) StringLiteral`,
	);

	if (computedClass.length === 0) {
		return;
	}

	// get the computed class value
	const classes = computedClass[0].getText();
	let modifiedClasses = classes.split(' ');

	// remove the classes that need to be removed
	modifiedClasses = modifiedClasses.filter((c) => !classesToRemove.includes(c));

	// add the classes that need to be added
	modifiedClasses = modifiedClasses.concat(classesToAdd);

	// update the classes
	const updatedClasses = modifiedClasses.join(' ');

	// replace the original classes with the updated classes
	const updatedContent = content.replace(classes, updatedClasses);

	tree.write(path, updatedContent);
}

interface UpdateHelmClassesSchema {
	/**
	 * The name of the components that need to be updated.
	 */
	component: string;
	/**
	 * The classes that need to be removed from the components.
	 */
	classesToRemove: string[];
	/**
	 * The classes that need to be added to the components.
	 */
	classesToAdd: string[];
}
