import { Component } from '@angular/core';

@Component({
	selector: 'spartan-typeset-docs-preview',
	template: `
		<div class="typeset">
			<h1>The Joke Tax Chronicles</h1>
			<p>
				Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne. One
				day, his advisors came to him with a problem: the kingdom was running out of money.
			</p>
			<h2>The King's Plan</h2>
			<p>
				The king thought long and hard, and finally came up with a
				<a href="https://spartan.ng">brilliant plan</a>
				: he would tax the jokes in the kingdom.
			</p>
			<blockquote>
				<p>
					"After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
				</p>
			</blockquote>
			<h3>The Joke Tax</h3>
			<p>The king's subjects were not amused. They grumbled and complained, but the king was firm:</p>
			<ul>
				<li>
					<strong>1st level of puns</strong>
					: 5 gold coins
				</li>
				<li>
					<strong>2nd level of jokes</strong>
					: 10 gold coins
				</li>
				<li>
					<strong>3rd level of one-liners</strong>
					: 20 gold coins
				</li>
			</ul>
			<p>
				As a result, people stopped telling jokes, and the kingdom fell into a gloom. Inline code like
				<code>taxJokes()</code>
				was all that remained.
			</p>
			<pre><code>const jokes = kingdom.jokes.filter((joke) =&gt; !joke.taxed);</code></pre>
			<table>
				<thead>
					<tr>
						<th>Level</th>
						<th>Jokes</th>
						<th align="right">Tax</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1st</td>
						<td>Puns</td>
						<td align="right">5 gold coins</td>
					</tr>
					<tr>
						<td>2nd</td>
						<td>Jokes</td>
						<td align="right">10 gold coins</td>
					</tr>
				</tbody>
			</table>
			<p>
				The moral of the story is: never underestimate the power of a good laugh and always be careful of bad ideas.
			</p>
		</div>
	`,
})
export default class TypesetDocsPreview {}
