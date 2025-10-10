/**
 * This file sets you up with structure needed for an ESLint rule.
 *
 * It leverages utilities from @typescript-eslint to allow TypeScript to
 * provide autocompletions etc for the configuration.
 *
 * Your rule's custom logic will live within the create() method below
 * and you can learn more about writing ESLint rules on the official guide:
 *
 * https://eslint.org/docs/developer-guide/working-with-rules
 *
 * You can also view many examples of existing rules here:
 *
 * https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/rules
 */

import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

export const RULE_NAME = 'prefer-rxjs-operator-compat';

const operators = [
	'audit',
	'auditTime',
	'buffer',
	'bufferCount',
	'bufferTime',
	'bufferToggle',
	'bufferWhen',
	'catchError',
	'combineAll',
	'concatAll',
	'concatMap',
	'concatMapTo',
	'count',
	'debounce',
	'debounceTime',
	'defaultIfEmpty',
	'delay',
	'delayWhen',
	'dematerialize',
	'distinct',
	'distinctUntilChanged',
	'distinctUntilKeyChanged',
	'elementAt',
	'endWith',
	'every',
	'exhaust',
	'exhaustMap',
	'expand',
	'filter',
	'finalize',
	'find',
	'findIndex',
	'first',
	'flatMap',
	'groupBy',
	'ignoreElements',
	'isEmpty',
	'last',
	'map',
	'mapTo',
	'materialize',
	'max',
	'mergeAll',
	'mergeMap',
	'mergeMapTo',
	'mergeScan',
	'min',
	'multicast',
	'observeOn',
	'pairwise',
	'pluck',
	'publish',
	'publishBehavior',
	'publishLast',
	'publishReplay',
	'reduce',
	'refCount',
	'repeat',
	'repeatWhen',
	'retry',
	'retryWhen',
	'sample',
	'sampleTime',
	'scan',
	'sequenceEqual',
	'share',
	'shareReplay',
	'single',
	'skip',
	'skipLast',
	'skipUntil',
	'skipWhile',
	'startWith',
	'subscribeOn',
	'switchAll',
	'switchMap',
	'switchMapTo',
	'take',
	'takeLast',
	'takeUntil',
	'takeWhile',
	'tap',
	'throttle',
	'throttleTime',
	'throwIfEmpty',
	'timeInterval',
	'timeout',
	'timeoutWith',
	'timestamp',
	'toArray',
	'window',
	'windowCount',
	'windowTime',
	'windowToggle',
	'windowWhen',
	'withLatestFrom',
	'zipAll',
];

export const rule = ESLintUtils.RuleCreator(() => __filename)({
	name: RULE_NAME,
	meta: {
		type: 'problem',
		docs: {
			description: 'Prefer importing RxJS operators from "rxjs/operators" instead of "rxjs".',
		},
		fixable: 'code',
		schema: [],
		messages: {
			preferOperatorImport: 'RxJS operators should be imported from "rxjs/operators" instead of "rxjs".',
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ImportDeclaration(node) {
				if (node.source.value !== 'rxjs') return;

				const improperSpecifiers = node.specifiers.filter(
					(specifier) =>
						specifier.type === 'ImportSpecifier' &&
						specifier.imported.type === 'Identifier' &&
						operators.includes(specifier.imported.name),
				) as TSESTree.ImportSpecifier[];

				if (improperSpecifiers.length > 0) {
					context.report({
						node,
						messageId: 'preferOperatorImport',
						fix(fixer) {
							const importSpecifiers = improperSpecifiers.map((specifier) => specifier.local.name);

							// keep any imports that are not RxJS operators
							const otherSpecifiers = node.specifiers.filter(
								(specifier) => specifier.type !== 'ImportSpecifier' || !importSpecifiers.includes(specifier.local.name),
							);

							if (otherSpecifiers.length === 0) {
								return fixer.replaceText(node, `import { ${importSpecifiers.join(', ')} } from 'rxjs/operators';`);
							}

							const rxjsImport = `import { ${otherSpecifiers.map((s) => s.local.name).join(', ')} } from 'rxjs';`;
							const newImportStatement = `import { ${importSpecifiers.join(', ')} } from 'rxjs/operators';`;

							return fixer.replaceText(node, `${rxjsImport}\n${newImportStatement}`);
						},
					});
				}
			},
		};
	},
});
