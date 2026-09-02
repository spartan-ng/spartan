import type { BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire';
import { HlmQuestionnaire, HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const items: readonly BrnQuestionnaireItemDefinition[] = [
	{
		name: 'direction',
		required: true,
		choices: [{ value: 'tool-calls' }, { value: 'approvals' }, { value: 'handoffs' }],
	},
	{
		name: 'signals',
		required: false,
		choices: [{ value: 'progress' }, { value: 'decisions' }, { value: 'risks' }],
	},
	{
		name: 'timing',
		required: true,
		choices: [{ value: 'now' }, { value: 'next-cycle' }, { value: 'backlog' }],
	},
];

const multipleItems: readonly BrnQuestionnaireItemDefinition[] = [
	{
		name: 'context',
		required: true,
		choices: [{ value: 'source' }, { value: 'tests' }, { value: 'docs' }, { value: 'history' }],
	},
];

export default {
	title: 'Questionnaire',
	component: HlmQuestionnaire,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmQuestionnaireImports],
		}),
	],
} as Meta<HlmQuestionnaire>;

type Story = StoryObj<HlmQuestionnaire>;

export const Default: Story = {
	render: () => ({
		props: { items },
		template: `
			<form
				hlmQuestionnaire
				class="mx-auto max-w-md"
				[items]="items"
				defaultItem="direction"
				shortcuts="letters"
				(submit)="$event.preventDefault()"
			>
				<div hlmQuestionnaireProgress></div>
				<fieldset hlmQuestionnaireItem name="direction" required>
					<legend hlmQuestionnaireTitle>What should the agent build next?</legend>
					<p hlmQuestionnaireDescription>Choose a direction or describe another task.</p>
					<div hlmQuestionnaireChoices>
						<label hlmQuestionnaireChoice value="tool-calls">
							<span class="font-medium">Tool call timeline</span>
						</label>
						<label hlmQuestionnaireChoice value="approvals">
							<span class="font-medium">Approval checkpoints</span>
						</label>
						<label hlmQuestionnaireChoice value="handoffs">
							<span class="font-medium">Sub-agent handoffs</span>
						</label>
						<input hlmQuestionnaireInput aria-label="Another agent feature" placeholder="Describe another feature…" />
					</div>
					<p hlmQuestionnaireError></p>
				</fieldset>
				<fieldset hlmQuestionnaireItem name="signals" multiple>
					<legend hlmQuestionnaireTitle>What should every progress update include?</legend>
					<p hlmQuestionnaireDescription>Select all that apply, or skip this question.</p>
					<div hlmQuestionnaireChoices>
						<label hlmQuestionnaireChoice value="progress">Progress</label>
						<label hlmQuestionnaireChoice value="decisions">Decisions</label>
						<label hlmQuestionnaireChoice value="risks">Risks</label>
					</div>
				</fieldset>
				<fieldset hlmQuestionnaireItem name="timing" required>
					<legend hlmQuestionnaireTitle>When should work begin?</legend>
					<div hlmQuestionnaireChoices>
						<label hlmQuestionnaireChoice value="now">Start now</label>
						<label hlmQuestionnaireChoice value="next-cycle">Next development cycle</label>
						<label hlmQuestionnaireChoice value="backlog">Add it to the backlog</label>
					</div>
					<p hlmQuestionnaireError></p>
				</fieldset>
				<div hlmQuestionnaireActions>
					<button hlmQuestionnairePrevious>Previous</button>
					<button hlmQuestionnaireSkip>Skip</button>
					<button hlmQuestionnaireNext>Next</button>
					<button hlmQuestionnaireSubmit>Save plan</button>
				</div>
			</form>
		`,
	}),
};

export const Multiple: Story = {
	render: () => ({
		props: { items: multipleItems },
		template: `
			<form
				hlmQuestionnaire
				class="mx-auto max-w-md"
				[items]="items"
				shortcuts="letters"
				(submit)="$event.preventDefault()"
			>
				<fieldset hlmQuestionnaireItem name="context" multiple required>
					<legend hlmQuestionnaireTitle>What context should the agent inspect?</legend>
					<p hlmQuestionnaireDescription>Select every source that may affect the implementation.</p>
					<div hlmQuestionnaireChoices>
						<label hlmQuestionnaireChoice value="source">Relevant source files</label>
						<label hlmQuestionnaireChoice value="tests">Existing tests</label>
						<label hlmQuestionnaireChoice value="docs">Architecture documentation</label>
						<label hlmQuestionnaireChoice value="history">Recent commit history</label>
					</div>
					<p hlmQuestionnaireError></p>
				</fieldset>
				<div hlmQuestionnaireActions>
					<button hlmQuestionnaireSubmit>Share context</button>
				</div>
			</form>
		`,
	}),
};

export const Freeform: Story = {
	render: () => ({
		props: {
			items: [
				{
					name: 'approach',
					required: true,
					choices: [{ value: 'incremental' }, { value: 'module' }, { value: 'rewrite' }],
				},
			] satisfies BrnQuestionnaireItemDefinition[],
		},
		template: `
			<form
				hlmQuestionnaire
				class="mx-auto max-w-md"
				[items]="items"
				shortcuts="letters"
				(submit)="$event.preventDefault()"
			>
				<fieldset hlmQuestionnaireItem name="approach" required>
					<legend hlmQuestionnaireTitle>How should the agent approach this refactor?</legend>
					<p hlmQuestionnaireDescription>Choose a strategy or write a more specific instruction.</p>
					<div hlmQuestionnaireChoices>
						<label hlmQuestionnaireChoice value="incremental">Make the smallest safe change</label>
						<label hlmQuestionnaireChoice value="module">Refactor one module at a time</label>
						<label hlmQuestionnaireChoice value="rewrite">Replace the implementation completely</label>
						<input hlmQuestionnaireInput aria-label="Another refactoring approach" placeholder="Describe another approach…" />
					</div>
					<p hlmQuestionnaireError></p>
				</fieldset>
				<div hlmQuestionnaireActions>
					<button hlmQuestionnaireSubmit>Use this approach</button>
				</div>
			</form>
		`,
	}),
};
