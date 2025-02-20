import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlmBlockquote, hlmH1, hlmH2, hlmH3, hlmLead, hlmP, hlmUl } from '@spartan-ng/ui-typography-helm';

export const routeMeta: RouteMeta = {
	meta: metaWith(
		'spartan/examples - Typography',
		"SPARTAN comes with helpful directives that enforce consistent styling across your application's typography.",
	),
	title: 'spartan/examples - Typography',
};

@Component({
	selector: 'spartan-typography',
	imports: [HlmButtonDirective],
	host: {
		class: 'block p-2 sm:p-4 pb-16',
	},
	template: `
		<h1 class="${hlmH1}">The Joke Tax Chronicles</h1>
		<p class="${hlmLead} mt-4">
			Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne. One day,
			his advisors came to him with a problem: the kingdom was running out of money.
		</p>
		<h2 class="${hlmH2} mt-10">The King's Plan</h2>
		<p class="${hlmP}">
			The king thought long and hard, and finally came up with
			<a hlmBtn variant="link" class="px-0.5" href="#">a brilliant plan</a>
			: he would tax the jokes in the kingdom.
		</p>
		<blockquote class="${hlmBlockquote}">
			"After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
		</blockquote>
		<h3 class="${hlmH3} mt-8">The Joke Tax</h3>
		<p class="${hlmP}">The king's subjects were not amused. They grumbled and complained, but the king was firm:</p>
		<ul class="${hlmUl}">
			<li>1st level of puns: 5 gold coins</li>
			<li>2nd level of jokes: 10 gold coins</li>
			<li>3rd level of one-liners : 20 gold coins</li>
		</ul>
		<p class="${hlmP}">
			As a result, people stopped telling jokes, and the kingdom fell into a gloom. But there was one person who refused
			to let the king's foolishness get him down: a court jester named Jokester.
		</p>
		<h3 class="${hlmH3} mt-8">Jokester's Revolt</h3>
		<p class="${hlmP}">
			Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under the
			king's pillow, in his soup, even in the royal toilet. The king was furious, but he couldn't seem to stop Jokester.
		</p>
		<p class="${hlmP}">
			And then, one day, the people of the kingdom discovered that the jokes left by Jokester were so funny that they
			couldn't help but laugh. And once they started laughing, they couldn't stop.
		</p>
		<h3 class="${hlmH3} mt-8">The People's Rebellion</h3>
		<p class="${hlmP}">
			The people of the kingdom, feeling uplifted by the laughter, started to tell jokes and puns again, and soon the
			entire kingdom was in on the joke.
		</p>
		<!-- TODO: add table styles when creating table component -->
		<div class="my-6 w-full overflow-y-auto">
			<table class="w-full">
				<thead>
					<tr class="border-border even:bg-muted m-0 border-t p-0">
						<th
							class="border-border border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
						>
							King's Treasury
						</th>
						<th
							class="border-border border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
						>
							People's happiness
						</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-border even:bg-muted m-0 border-t p-0">
						<td
							class="border-border border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
						>
							Empty
						</td>
						<td
							class="border-border border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
						>
							Overflowing
						</td>
					</tr>
					<tr class="border-border even:bg-muted m-0 border-t p-0">
						<td
							class="border-border border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
						>
							Modest
						</td>
						<td
							class="border-border border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
						>
							Satisfied
						</td>
					</tr>
					<tr class="border-border even:bg-muted m-0 border-t p-0">
						<td
							class="border-border border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
						>
							Full
						</td>
						<td
							class="border-border border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
						>
							Ecstatic
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="${hlmP}">
			The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
			Jokester was declared a hero, and the kingdom lived happily ever after.
		</p>
		<p class="${hlmP}">
			The moral of the story is: never underestimate the power of a good laugh and always be careful of bad ideas.
		</p>
	`,
})
export default class TypographyPageComponent {}
