import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmCardFooterDirective, HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-card-preview',
	imports: [
		BrnCommandImports,
		HlmCommandImports,
		HlmCardImports,
		HlmLabelDirective,
		HlmInputDirective,
		HlmCardFooterDirective,
		HlmButtonDirective,
	],
	providers: [provideIcons({ lucideCheck, lucideChevronDown })],
	template: `
		<section class="w-full max-w-sm" hlmCard>
			<div hlmCardHeader>
				<h3 hlmCardTitle>Login to your account</h3>
				<p hlmCardDescription>Enter your email below to login to your account</p>

				<div hlmCardAction>
					<button hlmBtn variant="link">Sign Up</button>
				</div>
			</div>

			<div hlmCardContent>
				<form>
					<div class="flex flex-col gap-6">
						<div class="grid gap-2">
							<label hlmLabel for="email">Email</label>
							<input type="email" id="email" placeholder="m@example.com" required hlmInput />
						</div>

						<div class="grid gap-2">
							<div class="flex items-center">
								<label hlmLabel for="password">Password</label>
								<a href="#" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
									Forgot your password?
								</a>
							</div>
							<input type="password" id="password" hlmInput />
						</div>
					</div>
				</form>
			</div>

			<div hlmCardFooter class="flex-col gap-2">
				<button hlmBtn type="submit" class="w-full">Login</button>
				<button hlmBtn variant="outline" class="w-full">Login with Google</button>
			</div>
		</section>
	`,
})
export class CardPreviewComponent {}

export const defaultCode = `import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmCardFooterDirective, HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-card-preview',
	imports: [
		BrnCommandImports,
		HlmCommandImports,
		HlmCardImports,
		HlmLabelDirective,
		HlmInputDirective,
		HlmCardFooterDirective,
		HlmButtonDirective,
	],
	providers: [provideIcons({ lucideCheck, lucideChevronDown })],
	template: \`
		<section class="w-full max-w-sm" hlmCard>
			<div hlmCardHeader>
				<h3 hlmCardTitle>Login to your account</h3>
				<p hlmCardDescription>Enter your email below to login to your account</p>

				<div hlmCardAction>
					<button hlmBtn variant="link">Sign Up</button>
				</div>
			</div>

			<div hlmCardContent>
				<form>
					<div class="flex flex-col gap-6">
						<div class="grid gap-2">
							<label hlmLabel for="email">Email</label>
							<input type="email" id="email" placeholder="m@example.com" required hlmInput />
						</div>

						<div class="grid gap-2">
							<div class="flex items-center">
								<label hlmLabel for="password">Password</label>
								<a href="#" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
									Forgot your password?
								</a>
							</div>
							<input type="password" id="password" hlmInput />
						</div>
					</div>
				</form>
			</div>

			<div hlmCardFooter class="flex-col gap-2">
				<button hlmBtn type="submit" class="w-full">Login</button>
				<button hlmBtn variant="outline" class="w-full">Login with Google</button>
			</div>
		</section>
	\`,
})
export class CardPreviewComponent {}
`;

export const defaultImports = `
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
	HlmCardActionDirective,
} from '@spartan-ng/helm/card';
`;

export const defaultSkeleton = `
<section hlmCard>
  <div hlmCardHeader>
    <h3 hlmCardTitle>Card Title</h3>
    <p hlmCardDescription>Card Description</p>
		<div hlmCardAction></div>
  </div>
  <p hlmCardContent>Card Content</p>
  <p hlmCardFooter>Card Footer</p>
</section>
`;
