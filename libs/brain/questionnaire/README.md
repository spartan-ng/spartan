# Questionnaire (Brain)

Headless multi-step questionnaire primitive. Ported from [shadcn Questionnaire](https://ui.shadcn.com/docs/components/base/questionnaire).

## Anatomy

```html
<form brnQuestionnaire [items]="items" shortcuts="letters" (submit)="onSubmit($event)">
	<div brnQuestionnaireProgress></div>

	<fieldset brnQuestionnaireItem name="direction" required>
		<legend brnQuestionnaireTitle>What should we build next?</legend>
		<p brnQuestionnaireDescription>Choose a direction.</p>
		<div brnQuestionnaireChoices>
			<label brnQuestionnaireChoice value="a">
				<input brnQuestionnaireChoiceInput />
				<span brnQuestionnaireChoiceLabel>Option A</span>
				<span brnQuestionnaireChoiceShortcut></span>
			</label>
			<input brnQuestionnaireInput placeholder="Other…" />
		</div>
		<p brnQuestionnaireError></p>
	</fieldset>

	<button brnQuestionnairePrevious>Previous</button>
	<button brnQuestionnaireSkip>Skip</button>
	<button brnQuestionnaireNext>Next</button>
	<button brnQuestionnaireSubmit>Submit</button>
</form>
```

## Form submit

Each item implements `ControlValueAccessor`, so Signal Forms can bind `[formField]` on the fieldset. Use `name` for the questionnaire item id, not the Signal Forms field path. Answers also stay on native form controls, so `FormData` still works:

```ts
onSubmit(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const data = new FormData(form);
  const direction = data.get('direction');
  const signals = data.getAll('signals');
}
```

## Behavior

- Ordered items from `items` (or DOM order when omitted)
- Active item is shown; inactive items are `hidden` + `inert`
- Status per item: `unanswered` | `answered` | `skipped`
- Required validation blocks Next / Submit
- Optional items can be skipped
- Keyboard: letter/number shortcuts, Enter to confirm, arrows to move
- Controlled active item via `[(item)]`
