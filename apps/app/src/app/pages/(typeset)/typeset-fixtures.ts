export const TYPESET_CHAT_QUESTION =
	'My Angular dev server takes forever to start. How do I figure out what is actually slow?';

export const TYPESET_DOCS_HTML = `
<h1>Building a Streaming Chatbot</h1>
<p>The <code>chat()</code> signal makes it effortless to create a conversational user interface for your chatbot application. It enables the streaming of chat messages from your AI provider, manages the chat state, and updates the UI automatically as new messages arrive.</p>
<p>To summarize, the <code>chat()</code> signal provides the following features:</p>
<ul>
<li><strong>Message Streaming</strong>: All the messages from the AI provider are streamed to the chat UI in real time.</li>
<li><strong>Managed State</strong>: The signal manages the state for input, messages, status, error and more for you.</li>
<li><strong>Seamless Integration</strong>: Easily integrate your chat AI into any design or layout with minimal effort.</li>
</ul>
<p>In this guide, you will learn how to use the <code>chat()</code> signal to create a chatbot application with real-time message streaming. Check out the <a href="#">chatbot with tools guide</a> to learn how to use tools in your chatbot.</p>
<h2>Example</h2>
<p>The request flow works like this:</p>
<ol>
<li>The user submits a message and <code>sendMessage()</code> posts it to your API route.</li>
<li>Your route calls the provider and returns a UI message stream.</li>
<li>The signal appends chunks to the last message as they arrive, re-rendering as it goes.</li>
</ol>
<pre><code>@Component({
  selector: 'app-chat',
  template: \`
    @for (message of messages(); track message.id) {
      &lt;app-message [message]="message" /&gt;
    }
    &lt;app-chat-input (submitted)="sendMessage($event)" /&gt;
  \`,
})
export class ChatComponent {
  protected readonly messages = inject(ChatStore).messages;
}</code></pre>
<pre><code>export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}</code></pre>
<blockquote><p>UI messages have a <code>parts</code> property that contains the message parts. Render the <code>parts</code> property instead of <code>content</code>: it supports text, tool invocation and tool results in one shape.</p></blockquote>
<p>The <code>chat()</code> signal requests your AI provider endpoint whenever the user sends a message. Messages stream back in real time and are displayed in the chat UI.</p>
<h2>Customized UI</h2>
<p><code>chat()</code> also provides ways to manage the chat message states via code, show status, and update messages without being triggered by user interactions.</p>
<h3>Status</h3>
<p>The <code>chat()</code> signal returns a <code>status</code>. It has the following possible values:</p>
<ul>
<li><code>submitted</code>: the message has been sent to the API and we are awaiting the response stream.</li>
<li><code>streaming</code>: the response is actively streaming in from the API, receiving chunks of data.</li>
<li><code>ready</code>: the full response has been received and processed; a new message can be submitted.</li>
<li><code>error</code>: an error occurred during the request, preventing completion.</li>
</ul>
<pre><code>const { messages, sendMessage, status, stop } = chat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});</code></pre>
<h3>Error state</h3>
<p>The <code>error</code> state reflects the error thrown during the fetch request. Use it to show a message, disable the submit button, or offer a retry:</p>
<blockquote><p>Show a generic error message such as "Something went wrong." It avoids leaking information from the server.</p></blockquote>
<h3>Cancellation and regeneration</h3>
<p>You can abort a response while it is still streaming by calling the <code>stop</code> function. Press <kbd>Esc</kbd> to cancel from the input.</p>
<pre><code>const { stop, status } = chat();

&lt;button (click)="stop()" [disabled]="status() !== 'streaming'"&gt;
  Stop
&lt;/button&gt;</code></pre>
<hr>
<h2>API reference</h2>
<h3>chat(options)</h3>
<p>Creates a chat helper. All options are optional; the defaults talk to <code>/api/chat</code> and render at native stream speed.</p>
<table>
  <thead>
    <tr><th>Prop</th><th>Type</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>transport</code></td><td><code>ChatTransport&lt;UIMessage&gt;</code></td><td>How messages reach your API route</td></tr>
    <tr><td><code>messages</code></td><td><code>UIMessage[]</code></td><td>Initial messages to seed the conversation</td></tr>
    <tr><td><code>onFinish</code></td><td><code>(event: FinishEvent) =&gt; void</code></td><td>Runs when the assistant response completes</td></tr>
    <tr><td><code>onError</code></td><td><code>(error: Error) =&gt; void</code></td><td>Runs when the fetch request fails</td></tr>
    <tr><td><code>throttle</code></td><td><code>number</code></td><td>Milliseconds between UI updates while streaming</td></tr>
  </tbody>
</table>
<h2>Event callbacks</h2>
<p><code>chat()</code> provides optional callbacks for different stages of the chatbot lifecycle:</p>
<ul>
<li><code>onFinish</code>: called when the assistant response completes. The event includes the message and flags for abort, disconnect and errors.</li>
<li><code>onError</code>: called when an error occurs during the fetch request.</li>
<li><code>onData</code>: called whenever a data part is received.</li>
</ul>
<pre><code>const { messages } = chat({
  onFinish: ({ message }) =&gt; saveToHistory(message),
  onError: (error) =&gt; console.error(error),
});</code></pre>
<hr>
<h2>Notes</h2>
<p><mark>Streaming stability matters.</mark> Typeset only adds <code>margin-block-start</code>, so a new chunk never shifts the blocks above it.</p>
<details>
  <summary>Why not <code>prose</code>?</summary>
  <p>Prose bakes a fixed <code>rem</code> scale into the stylesheet. Typeset derives its scale from three variables and follows the surrounding container.</p>
</details>
<p>Footnote style references work too, like this<sup><a href="#fn1">1</a></sup>.</p>
<ol class="footnotes" data-footnotes>
  <li id="fn1">Typeset keeps footnotes muted and slightly smaller than body copy.</li>
</ol>
`;

export const TYPESET_CHAT_HTML = `
<p>Slow dev startup in Angular almost always comes down to one of three things: module count, heavy config work at boot, or something outside the bundler entirely. Here is how to narrow it down fast.</p>
<h3>1. Get a baseline</h3>
<p>Start the server with profiling on and note the two numbers it prints:</p>
<pre><code>NG_BUILD_MAX_WORKERS=1 pnpm start --verbose</code></pre>
<ul>
<li><strong>Startup time</strong>: everything before "Local". Config loading, env files, plugins.</li>
<li><strong>First compile</strong>: the time after you hit a route. Module graph size lives here.</li>
</ul>
<h3>2. Check the usual suspects</h3>
<table>
<thead>
<tr><th>Symptom</th><th>Likely cause</th></tr>
</thead>
<tbody>
<tr><td>Slow before "Local"</td><td>Heavy <code>angular.json</code>, sync I/O in config, large <code>.env</code> cascade</td></tr>
<tr><td>Slow first page</td><td>Barrel files pulling in whole icon or UI libraries</td></tr>
<tr><td>Slow every save</td><td>Type checking or lint running in the dev loop</td></tr>
</tbody>
</table>
<p>The barrel-file one is the classic. A single <code>import { lucideCheck } from '@ng-icons/lucide'</code> through a barrel can pull thousands of modules into the graph. Fix it with subpath imports:</p>
<pre><code>// before
import { lucideCheck } from '@ng-icons/lucide';

// after
import { lucideCheck } from '@ng-icons/lucide';</code></pre>
<h3>3. Measure, do not guess</h3>
<p>If neither jumps out, generate a trace and look at the actual spans:</p>
<pre><code>pnpm nx build app --stats-json
npx source-map-explorer dist/apps/app/client/*.js</code></pre>
<blockquote><p>Compare against a bare <code>ng new</code> on the same machine first. If that is also slow, the problem is your machine or antivirus scanning <code>node_modules</code>, not your app.</p></blockquote>
<p>Want to paste the first few lines of your trace output? I can point at the exact span that is eating the time.</p>
`;

export const TYPESET_ARTICLE_HTML = `
<h1>A Morning at the Letterpress Museum</h1>
<p>The first thing you notice is the smell: machine oil, paper dust, and a century of ink that never fully dries. The second thing is the sound. A working letterpress shop is not quiet, and the museum on Greer Street keeps three presses working, because, as the docent told me within a minute of my arrival, <em>a silent press is just furniture</em>.</p>
<p>I went because I write software that arranges text on screens, and I had started to suspect that everything hard about my job had been solved a hundred years ago by people with steel tools and no undo. I left four hours later with ink on my sleeve and a notebook full of confirmations.</p>
<figure>
  <img src="https://images.unsplash.com/photo-1629968417841-d87296c4205b?q=80&amp;w=1200&amp;h=675&amp;fit=crop" alt="Textured surface, worn by use." width="1200" height="675">
  <figcaption>Ink before it becomes language.</figcaption>
</figure>
<h2>The composing room</h2>
<p>Type lives in shallow wooden drawers called cases, and the layout of a case is itself a piece of interface design: the letters you reach for most sit nearest your hand, in the biggest compartments. Nobody alphabetized them. The arrangement was settled by frequency, argued over for a generation, and then never changed again, which is roughly the story of every good default I have ever shipped.</p>
<p>A compositor working at full speed sets about two thousand characters an hour, reading the manuscript with one eye while the other confirms each pick. The docent, a retired compositor named <strong>Ruth Okafor</strong>, demonstrated without looking down once. When I asked how long that took to learn she said, "The hands take a year. Knowing when a line is wrong takes ten."</p>
<blockquote>
  <p>Every em of space in this room is a physical object. You want more air between two lines, you go get the lead and you carry it back. It keeps your opinions about spacing very honest.</p>
</blockquote>
<p>That line rearranged something in my head. The strips of lead that printers wedged between lines of type are why we still say <a href="#">leading</a>. On my screen, spacing is a number I can change in a keystroke, and so I change it constantly, carelessly. Ruth's shop had exactly four widths of lead, and the whole trade agreed on them, and a hundred years of books came out beautiful anyway. Constraint was not the obstacle to the craft. It was the craft.</p>
<h2>What the metal knows</h2>
<figure>
  <img src="https://images.unsplash.com/photo-1637325258040-d2f09636ecf6?q=80&amp;w=900&amp;h=1200&amp;fit=crop" alt="Recycled paper, up close." width="900" height="1200">
  <figcaption>Space is material.</figcaption>
</figure>
<p>Three things the metal insists on, which screens let us forget:</p>
<ul>
  <li><strong>Space is material.</strong> Word spaces, line leads, and margins are objects with widths. Nothing is "auto." Someone chose everything.</li>
  <li><strong>Hierarchy is expensive.</strong> Changing size means walking to a different case. Printers built emphasis from weight and space first because size was the costly move, and their pages read better for it.</li>
  <li><strong>The page is finished before it is printed.</strong> A locked-up chase either holds together or it does not. There is a satisfying finality to it that no deploy has ever given me.</li>
</ul>
<p>None of this is nostalgia, or not only. The constraints were real costs, and digital type was right to remove them. But removal has a second-order effect: when nothing is expensive, nothing forces a decision, and unforced decisions drift. The printers' defaults survived because changing them was work. Ours have to survive on discipline, which is a weaker material.</p>
<hr>
<h2>Field notes</h2>
<p>Practical things I wrote down, in the order I wrote them:</p>
<ol>
  <li>Ruth sets solid (no leading) only for lines shorter than the alphabet. Anything longer gets air. Our line-length rules agree, which pleased me more than it should have.</li>
  <li>The shop's "house style" fits on an index card taped inside a cabinet door. Four leads, two faces, three sizes. An entire design system, physically enumerable.</li>
  <li>Apprentices learn distribution (putting type away) before composition. You learn a system by returning things to it.</li>
</ol>
<p>The museum runs open studio on the first Saturday of every month, and they will let you set your own name if you ask. Mine came out crooked. Ruth looked at it for a moment and said it was a common beginner's error: I had been so careful choosing the letters that I forgot to check the spaces. I have been thinking about that all week.</p>
<p><em>The Greer Street Press Museum is open Thursday through Sunday. If you go, bring a jacket; the composing room is kept cold for the metal.</em></p>
`;

export const TYPESET_CHANGELOG_HTML = `
<h1>Changelog</h1>
<h2>v1.11.0</h2>
<p><em>November 25, 2026</em></p>
<ul>
  <li><strong>Added:</strong> <code>typeset</code>, a single stylesheet for rendered markdown. Wrap content in a <code>typeset</code> container and pick a preset.</li>
  <li><strong>Added:</strong> a typeset builder for choosing fonts and rhythm, with copy-ready CSS.</li>
  <li><strong>Changed:</strong> selectors are scoped with <code>:where()</code>, so utilities override typeset without <code>!important</code>.</li>
  <li><strong>Fixed:</strong> appending a block no longer restyles the blocks above it while streaming.</li>
  <li><strong>Fixed:</strong> table separators now live on cells, so a new row does not restyle the row above it.</li>
</ul>
<h3>Breaking changes</h3>
<p>The <code>prose</code> plugin is no longer required for markdown surfaces. Replace it with the <code>typeset</code> class:</p>
<pre><code>- &lt;div class="prose"&gt;
+ &lt;div class="typeset typeset-docs"&gt;</code></pre>
<h2>v1.10.1</h2>
<p><em>October 30, 2026</em></p>
<ul>
  <li><strong>Fixed:</strong> a race where two synchronous writes in the same tick could notify in reverse order under zoneless change detection.</li>
  <li><strong>Docs:</strong> clarified that stores must be hoisted out of components, with a lint rule to catch it.</li>
</ul>
<h2>v1.10.0</h2>
<p><em>October 12, 2026</em></p>
<ul>
  <li><strong>Added:</strong> Angular 21 support; the primitives no longer touch <code>window</code> during server rendering.</li>
  <li><strong>Deprecated:</strong> the <code>hlm*</code> typography classes, superseded by Typeset. A console warning links to the migration note.</li>
  <li><strong>Performance:</strong> subscription bookkeeping moved from an array to a <code>Set</code>; unsubscribe is now O(1).</li>
</ul>
`;

export const TYPESET_NOTES_HTML = `
<h1>Platform sync: week 27</h1>
<p><em>July 3, 2026 · 25 min · recording available</em></p>
<h2>Decisions</h2>
<ul>
  <li>Ship the streaming endpoint behind a flag on Tuesday; full rollout gated on p95 latency holding under 800ms for 48 hours.</li>
  <li>Adopt cursor pagination for the activity feed. Offset stays on the admin tables only, capped at page 500.</li>
  <li>Postpone the queue migration to Q3. Nobody could name a current failure it fixes.</li>
</ul>
<h2>Action items</h2>
<ul class="contains-task-list">
  <li class="task-list-item"><input type="checkbox" checked disabled> <strong>Mia:</strong> flag config and kill switch for the streaming endpoint</li>
  <li class="task-list-item"><input type="checkbox" disabled> <strong>Devon:</strong> latency dashboard with the 800ms line drawn on it</li>
  <li class="task-list-item"><input type="checkbox" disabled> <strong>Sam:</strong> write the cursor encoding RFC, one page max</li>
  <li class="task-list-item"><input type="checkbox" disabled> <strong>Priya:</strong> close out the three stale runbook pages before Friday</li>
</ul>
<h2>Discussion</h2>
<ul>
  <li>Streaming rollout
    <ul>
      <li>Retry behavior on disconnect is still client-defined; the server sends <code>retry-after</code> but nobody reads it.</li>
      <li>Agreement: the SDK should honor it; apps that hand-roll fetch are on their own.
        <ul>
          <li>Devon volunteered to add it to the SDK changelog as a "behavior change" callout.</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>On-call load
    <ul>
      <li>Pages are down 40% since the alert dedup work. Two of the remaining alerts are known-noisy and owned by nobody.</li>
      <li>Priya takes both; if they cannot be fixed in an hour each, they get deleted.</li>
    </ul>
  </li>
</ul>
<dl>
  <dt>p95</dt>
  <dd>The 95th percentile response time over the rolling five-minute window.</dd>
  <dt>dedup</dt>
  <dd>Collapsing identical alerts into one notification before paging.</dd>
</dl>
<blockquote>
  <p>"If an alert has fired twelve times and been actioned zero times, it isn't an alert, it's a screensaver."</p>
</blockquote>
`;

export const TYPESET_FIXTURES: Record<string, string> = {
	docs: TYPESET_DOCS_HTML,
	chat: TYPESET_CHAT_HTML,
	article: TYPESET_ARTICLE_HTML,
	changelog: TYPESET_CHANGELOG_HTML,
	notes: TYPESET_NOTES_HTML,
};
