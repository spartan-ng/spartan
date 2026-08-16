# Questionnaire (Helm)

Styled questionnaire built on `@spartan-ng/brain/questionnaire`.

## Anatomy

```html
<form hlmQuestionnaire [formRoot]="form" [items]="items" shortcuts="letters">
	<div hlmQuestionnaireProgress></div>

	<fieldset hlmQuestionnaireItem name="direction" required [formField]="form.direction">
		<legend hlmQuestionnaireTitle>What should we build next?</legend>
		<p hlmQuestionnaireDescription>Choose a direction.</p>
		<div hlmQuestionnaireChoices>
			<label hlmQuestionnaireChoice value="tool-calls">
				<span class="font-medium">Tool call timeline</span>
				<span hlmQuestionnaireChoiceDescription>Show what the agent ran.</span>
			</label>
			<input hlmQuestionnaireInput placeholder="Describe another feature…" />
		</div>
		<p hlmQuestionnaireError></p>
	</fieldset>

	<div hlmQuestionnaireActions>
		<button hlmQuestionnairePrevious>Previous</button>
		<button hlmQuestionnaireSkip>Skip</button>
		<button hlmQuestionnaireNext>Next</button>
		<button hlmQuestionnaireSubmit>Submit</button>
	</div>
</form>
```

Import `form`, `FormField`, and `FormRoot` from `@angular/forms/signals` plus `HlmQuestionnaireImports`. Styles live in the registry CSS as `.spartan-questionnaire*`.
