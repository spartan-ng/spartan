import { Component } from '@angular/core';
import { hlmBlockquote, hlmH1, hlmH2, hlmH3, hlmLead, hlmP, hlmUl } from '@spartan-ng/helm/typography';

@Component({
	selector: 'spartan-typography-preview',
	template: `
		<h1 class="${hlmH1}">The Joke Tax Chronicles</h1>
		<p class="${hlmLead} mt-4">
			Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne. One day,
			his advisors came to him with a problem: the kingdom was running out of money.
		</p>
		<h2 class="${hlmH2} mt-10">The King's Plan</h2>
		<p class="${hlmP}">
			The king thought long and hard, and finally came up with a brilliant plan : he would tax the jokes in the kingdom.
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
		<p class="${hlmP}">
			The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
			Jokester was declared a hero, and the kingdom lived happily ever after.
		</p>
		<p class="${hlmP}">
			The moral of the story is: never underestimate the power of a good laugh and always be careful of bad ideas.
		</p>
	`,
})
export default class TypographyPreview {}

export const themingCode = `
import { Component } from '@angular/core';
import { hlmBlockquote, hlmH1, hlmH2, hlmH3, hlmLead, hlmP, hlmUl } from '@spartan-ng/helm/typography';

@Component({
  selector: 'spartan-typography-preview',
  template: \`
    <h1 class="\${hlmH1}">The Joke Tax Chronicles</h1>
    <p class="\${hlmLead} mt-4">
      Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne. One day,
      his advisors came to him with a problem: the kingdom was running out of money.
    </p>
    <h2 class="\${hlmH2} mt-10">The King's Plan</h2>
    <p class="\${hlmP}">
      The king thought long and hard, and finally came up with a brilliant plan : he would tax the jokes in the kingdom.
    </p>
    <blockquote class="\${hlmBlockquote}">
      "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
    </blockquote>
    <h3 class="\${hlmH3} mt-8">The Joke Tax</h3>
    <p class="\${hlmP}">The king's subjects were not amused. They grumbled and complained, but the king was firm:</p>
    <ul class="\${hlmUl}">
      <li>1st level of puns: 5 gold coins</li>
      <li>2nd level of jokes: 10 gold coins</li>
      <li>3rd level of one-liners : 20 gold coins</li>
    </ul>
    <p class="\${hlmP}">
      As a result, people stopped telling jokes, and the kingdom fell into a gloom. But there was one person who refused
      to let the king's foolishness get him down: a court jester named Jokester.
    </p>
    <h3 class="\${hlmH3} mt-8">Jokester's Revolt</h3>
    <p class="\${hlmP}">
      Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under the
      king's pillow, in his soup, even in the royal toilet. The king was furious, but he couldn't seem to stop Jokester.
    </p>
    <p class="\${hlmP}">
      And then, one day, the people of the kingdom discovered that the jokes left by Jokester were so funny that they
      couldn't help but laugh. And once they started laughing, they couldn't stop.
    </p>
    <h3 class="\${hlmH3} mt-8">The People's Rebellion</h3>
    <p class="\${hlmP}">
      The people of the kingdom, feeling uplifted by the laughter, started to tell jokes and puns again, and soon the
      entire kingdom was in on the joke.
    </p>
    <p class="\${hlmP}">
      The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
      Jokester was declared a hero, and the kingdom lived happily ever after.
    </p>
    <p class="\${hlmP}">
      The moral of the story is: never underestimate the power of a good laugh and always be careful of bad ideas.
    </p>
  \`,
})
export default class TypographyPreviewComponent {}
`;

export const h1Code = `
import { Component } from '@angular/core';
import { hlmH1 } from '@spartan-ng/helm/typography';

@Component({
  selector: 'spartan-h1',
  template: \`
    <h1 class="\${hlmH1}">The Joke Tax Chronicles</h1>
  \`,
})
export default class H1Component {}
`;

export const h2Code = `
import { Component } from '@angular/core';
import { hlmH2 } from '@spartan-ng/helm/typography';

@Component({
  selector: 'spartan-h2',
  template: \`
    <h2 class="\${hlmH2}">The People of the Kingdom</h2>
  \`,
})
export default class H1Component {}
`;

export const h3Code = `
import { Component } from '@angular/core';
import { hlmH3 } from '@spartan-ng/helm/typography';

@Component({
  selector: 'spartan-h3',
  template: \`
    <h3 class="\${hlmH3}">The Joke Tax</h3>
  \`,
})
export default class H3Component {}
`;

export const h4Code = `
import { Component } from '@angular/core';
import { hlmH4 } from '@spartan-ng/helm/typography';

@Component({
  selector: 'spartan-h4',
  template: \`
    <h4 class="\${hlmH4}">People stopped telling jokes</h4>
  \`,
})
export default class H4Component {}
`;

export const pCode = `
import { Component } from '@angular/core';
import { hlmP } from '@spartan-ng/helm/typography';

@Component({
  selector: 'spartan-p',
  template: \`
    <p class="\${hlmP}">
      The king, seeing how much happier his subjects were,
      realized the error of his ways and repealed the joke tax.
    </p>
  \`,
})
export default class PComponent {}
`;

export const blockquoteCode = `
import { Component } from '@angular/core';
import { hlmBlockquote } from '@spartan-ng/helm/typography';

@Component({
  selector: 'spartan-blockquote',
  template: \`
    <blockquote class="\${hlmBlockquote}">
      "After all," he said, "everyone enjoys a good joke,
      so it's only fair that they should pay for the privilege."
    </blockquote>
  \`,
})
export default class BlockquoteComponent {}
`;

export const listCode = `
import { Component } from '@angular/core';
import { hlmUl } from '@spartan-ng/helm/typography';

@Component({
  selector: 'spartan-list',
  template: \`
    <ul class="\${hlmUl}">
      <li>1st level of puns: 5 gold coins</li>
      <li>2nd level of jokes: 10 gold coins</li>
      <li>3rd level of one-liners : 20 gold coins</li>
    </ul>
  \`,
})
export default class ListComponent {}
`;

export const codeCode = `
import { Component } from '@angular/core';
import { hlmCode } from '@spartan-ng/helm/typography';

@Component({
  selector: 'spartan-code',
  template: \`
    <code class="\${hlmCode}">@radix-ui/react-alert-dialog</code>
  \`,
})
export default class CodeComponent {}
`;

export const leadCode = `
import { Component } from '@angular/core';
import { hlmLead } from '@spartan-ng/helm/typography';

@Component({
  selector: 'spartan-lead',
  template: \`
    <p class="\${hlmLead}">A modal dialog that interrupts the user with important content and expects a response.</p>
  \`,
})
export default class LeadComponent {}
`;

export const largeCode = `
import { Component } from '@angular/core';
import { hlmLarge } from '@spartan-ng/helm/typography';

@Component({
  selector: 'spartan-large',
  template: \`
    <p class="\${hlmLarge}">Are you sure absolutely sure?</p>
  \`,
})
export default class LargeComponent {}
`;

export const smallCode = `
import { Component } from '@angular/core';
import { hlmSmall } from '@spartan-ng/helm/typography';

@Component({
  selector: 'spartan-small',
  template: \`
    <p class="\${hlmSmall}">Email address</p>
  \`,
})
export default class SmallComponent {}
`;

export const mutedCode = `
import { Component } from '@angular/core';
import { hlmMuted } from '@spartan-ng/helm/typography';

@Component({
  selector: 'spartan-muted',
  template: \`
    <p class="\${hlmMuted}">Enter your email address.</p>
  \`,
})
export default class MutedComponent {}
`;
