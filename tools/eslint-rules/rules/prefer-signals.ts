// This will hopefully be a part of angular-eslint soon, but for now, we can use it as a custom rule
// https://github.com/angular-eslint/angular-eslint/pull/1872
import { Selectors } from '@angular-eslint/utils';
import type { ParserServicesWithTypeInformation, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

type Options = [
	{
		typesToReplace: string[];
		preferReadonly: boolean;
		preferInputSignal: boolean;
		preferQuerySignal: boolean;
		useTypeChecking: boolean;
		signalCreationFunctions: string[];
	},
];

const DEFAULT_OPTIONS: Options[number] = {
	typesToReplace: ['BehaviorSubject'],
	preferReadonly: true,
	preferInputSignal: true,
	preferQuerySignal: true,
	useTypeChecking: true,
	signalCreationFunctions: [],
};

const KNOWN_SIGNAL_TYPES: ReadonlySet<string> = new Set([
	'InputSignal',
	'ModelSignal',
	'Signal',
	'WritableSignal',
	'ResourceRef',
]);
const KNOWN_SIGNAL_CREATION_FUNCTIONS: ReadonlySet<string> = new Set([
	'computed',
	'contentChild',
	'contentChildren',
	'input',
	'linkedSignal',
	'model',
	'resource',
	'signal',
	'toSignal',
	'viewChild',
	'viewChildren',
]);

export type MessageIds =
	| 'preferInputSignal'
	| 'preferQuerySignal'
	| 'preferReadonly'
	| 'preferSignal'
	| 'suggestAddReadonlyModifier';

// NOTE: The rule will be available in ESLint configs as "@nx/workspace-prefer-signals"
export const RULE_NAME = 'prefer-signals';

export const rule = ESLintUtils.RuleCreator(() => __filename)({
	name: RULE_NAME,
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Prefer to use signals instead of `BehaviorSubject`, `@Input()`, `@ViewChild()` and other query decorators',
		},
		hasSuggestions: true,
		schema: [
			{
				type: 'object',
				properties: {
					typesToReplace: {
						type: 'array',
						items: { type: 'string' },
						default: DEFAULT_OPTIONS.typesToReplace,
					},
					preferReadonly: {
						type: 'boolean',
						default: DEFAULT_OPTIONS.preferReadonly,
					},
					preferInputSignal: {
						type: 'boolean',
						default: DEFAULT_OPTIONS.preferInputSignal,
					},
					preferQuerySignal: {
						type: 'boolean',
						default: DEFAULT_OPTIONS.preferQuerySignal,
					},
					useTypeChecking: {
						type: 'boolean',
						default: DEFAULT_OPTIONS.useTypeChecking,
					},
					signalCreationFunctions: {
						type: 'array',
						items: { type: 'string' },
						default: DEFAULT_OPTIONS.signalCreationFunctions,
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			preferSignal: 'Prefer to use `Signal` instead of {{type}}',
			preferInputSignal: 'Prefer to use `InputSignal` type instead of `@Input()` decorator',
			preferQuerySignal: 'Prefer to use `{{function}}` function instead of `{{decorator}}` decorator',
			preferReadonly:
				'Prefer to declare `Signal` properties as `readonly` since they are not supposed to be reassigned',
			suggestAddReadonlyModifier: 'Add `readonly` modifier',
		},
	},
	defaultOptions: [{ ...DEFAULT_OPTIONS }],
	create(
		context,
		[
			{
				typesToReplace = DEFAULT_OPTIONS.typesToReplace,
				preferReadonly = DEFAULT_OPTIONS.preferReadonly,
				preferInputSignal = DEFAULT_OPTIONS.preferInputSignal,
				preferQuerySignal = DEFAULT_OPTIONS.preferQuerySignal,
				signalCreationFunctions = DEFAULT_OPTIONS.signalCreationFunctions,
				useTypeChecking = DEFAULT_OPTIONS.useTypeChecking,
			},
		],
	) {
		let services: ParserServicesWithTypeInformation | undefined;
		const listener: ESLintUtils.RuleListener = {};

		if (typesToReplace.length > 0) {
			listener.NewExpression = (node) => {
				if (node.callee.type === AST_NODE_TYPES.Identifier && typesToReplace.includes(node.callee.name)) {
					context.report({
						node: node.callee,
						messageId: 'preferSignal',
						data: { type: node.callee.name },
					});
				}
			};
		}

		if (preferReadonly) {
			listener[`PropertyDefinition:not([readonly=true])`] = (node: TSESTree.PropertyDefinition) => {
				let shouldBeReadonly = false;

				if (node.typeAnnotation) {
					// Use the type annotation to determine
					// whether the property is a signal.
					if (node.typeAnnotation.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference) {
						const type = node.typeAnnotation.typeAnnotation;
						if (
							type.typeArguments &&
							type.typeName.type === AST_NODE_TYPES.Identifier &&
							KNOWN_SIGNAL_TYPES.has(type.typeName.name)
						) {
							shouldBeReadonly = true;
						}
					}
				} else {
					// There is no type annotation, so try to
					// use the value assigned to the property
					// to determine whether it would be a signal.
					if (node.value?.type === AST_NODE_TYPES.CallExpression) {
						let callee: TSESTree.Node = node.value.callee;
						// Some signal-creating functions have a `.required`
						// member. For example, `input.required()`.
						if (callee.type === AST_NODE_TYPES.MemberExpression) {
							if (callee.property.type === AST_NODE_TYPES.Identifier && callee.property.name !== 'required') {
								return;
							}
							callee = callee.object;
						}
						if (
							callee.type === AST_NODE_TYPES.Identifier &&
							(KNOWN_SIGNAL_CREATION_FUNCTIONS.has(callee.name) || signalCreationFunctions.includes(callee.name))
						) {
							shouldBeReadonly = true;
						}
					}

					if (!shouldBeReadonly && useTypeChecking && node.value) {
						services ??= ESLintUtils.getParserServices(context);
						const name = services.getTypeAtLocation(node.value).getSymbol()?.name;

						shouldBeReadonly = name !== undefined && KNOWN_SIGNAL_TYPES.has(name);
					}
				}

				if (shouldBeReadonly) {
					context.report({
						node: node.key,
						messageId: 'preferReadonly',
						suggest: [
							{
								messageId: 'suggestAddReadonlyModifier',
								fix: (fixer) => fixer.insertTextBefore(node.key, 'readonly '),
							},
						],
					});
				}
			};
		}

		if (preferInputSignal) {
			listener[Selectors.INPUT_DECORATOR] = (node) => {
				context.report({
					node,
					messageId: 'preferInputSignal',
				});
			};
		}

		if (preferQuerySignal) {
			listener['Decorator[expression.callee.name=/^(ContentChild|ContentChildren|ViewChild|ViewChildren)$/]'] = (
				node: TSESTree.Decorator,
			) => {
				const decorator = ((node.expression as TSESTree.CallExpression).callee as TSESTree.Identifier).name;
				context.report({
					node,
					messageId: 'preferQuerySignal',
					data: {
						function: decorator.slice(0, 1).toLowerCase() + decorator.slice(1),
						decorator,
					},
				});
			};
		}

		return listener;
	},
});
