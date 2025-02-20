import { Component } from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

@Component({
	selector: 'spartan-select-scrollable-preview',
	imports: [BrnSelectImports, HlmSelectImports],
	template: `
		<hlm-select scrollable="true" placeholder="Select a timezone">
			<hlm-select-trigger class="w-[280px]">
				<hlm-select-value />
			</hlm-select-trigger>
			<hlm-select-content class="max-h-96 min-w-[325px]">
				<hlm-select-scroll-up />

				<hlm-select-group>
					<hlm-select-label>North America</hlm-select-label>
					<hlm-option value="est">Eastern Standard Time (EST)</hlm-option>
					<hlm-option value="cst">Central Standard Time (CST)</hlm-option>
					<hlm-option value="mst">Mountain Standard Time (MST)</hlm-option>
					<hlm-option value="pst">Pacific Standard Time (PST)</hlm-option>
					<hlm-option value="akst">Alaska Standard Time (AKST)</hlm-option>
					<hlm-option value="hst">Hawaii Standard Time (HST)</hlm-option>
				</hlm-select-group>

				<hlm-select-group>
					<hlm-select-label>Europe & Africa</hlm-select-label>
					<hlm-option value="gmt">Greenwich Mean Time (GMT)</hlm-option>
					<hlm-option value="cet">Central European Time (CET)</hlm-option>
					<hlm-option value="eet">Eastern European Time (EET)</hlm-option>
					<hlm-option value="west">Western European Summer Time (WEST)</hlm-option>
					<hlm-option value="cat">Central Africa Time (CAT)</hlm-option>
					<hlm-option value="eat">East Africa Time (EAT)</hlm-option>
				</hlm-select-group>

				<hlm-select-group>
					<hlm-select-label>Asia</hlm-select-label>
					<hlm-option value="msk">Moscow Time (MSK)</hlm-option>
					<hlm-option value="ist">India Standard Time (IST)</hlm-option>
					<hlm-option value="cst_china">China Standard Time (CST)</hlm-option>
					<hlm-option value="jst">Japan Standard Time (JST)</hlm-option>
					<hlm-option value="kst">Korea Standard Time (KST)</hlm-option>
					<hlm-option value="ist_indonesia">Indonesia Central Standard Time (WITA)</hlm-option>
				</hlm-select-group>

				<hlm-select-group>
					<hlm-select-label>Australia & Pacific</hlm-select-label>
					<hlm-option value="awst">Australian Western Standard Time (AWST)</hlm-option>
					<hlm-option value="acst">Australian Central Standard Time (ACST)</hlm-option>
					<hlm-option value="aest">Australian Eastern Standard Time (AEST)</hlm-option>
					<hlm-option value="nzst">New Zealand Standard Time (NZST)</hlm-option>
					<hlm-option value="fjt">Fiji Time (FJT)</hlm-option>
				</hlm-select-group>

				<hlm-select-group>
					<hlm-select-label>South America</hlm-select-label>
					<hlm-option value="art">Argentina Time (ART)</hlm-option>
					<hlm-option value="bot">Bolivia Time (BOT)</hlm-option>
					<hlm-option value="brt">Brasilia Time (BRT)</hlm-option>
					<hlm-option value="clt">Chile Standard Time (CLT)</hlm-option>
				</hlm-select-group>

				<hlm-select-scroll-down />
			</hlm-select-content>
		</hlm-select>
	`,
})
export class SelectScrollablePreviewComponent {}

export const scrollableCode = `import { Component } from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

@Component({
	selector: 'spartan-select-scrollable-preview',
	standalone: true,
	imports: [BrnSelectImports, HlmSelectImports],
	template: \`
		<hlm-select scrollable="true" placeholder="Select a timezone">
			<hlm-select-trigger class="w-[280px]">
				<hlm-select-value />
			</hlm-select-trigger>
			<hlm-select-content class="max-h-96 min-w-[325px]">
				<hlm-select-scroll-up/>

				<hlm-select-group>
					<hlm-select-label>North America</hlm-select-label>
					<hlm-option value="est">Eastern Standard Time (EST)</hlm-option>
					<hlm-option value="cst">Central Standard Time (CST)</hlm-option>
					<hlm-option value="mst">Mountain Standard Time (MST)</hlm-option>
					<hlm-option value="pst">Pacific Standard Time (PST)</hlm-option>
					<hlm-option value="akst">Alaska Standard Time (AKST)</hlm-option>
					<hlm-option value="hst">Hawaii Standard Time (HST)</hlm-option>
				</hlm-select-group>

				<hlm-select-group>
					<hlm-select-label>Europe & Africa</hlm-select-label>
					<hlm-option value="gmt">Greenwich Mean Time (GMT)</hlm-option>
					<hlm-option value="cet">Central European Time (CET)</hlm-option>
					<hlm-option value="eet">Eastern European Time (EET)</hlm-option>
					<hlm-option value="west">Western European Summer Time (WEST)</hlm-option>
					<hlm-option value="cat">Central Africa Time (CAT)</hlm-option>
					<hlm-option value="eat">East Africa Time (EAT)</hlm-option>
				</hlm-select-group>

				<hlm-select-group>
					<hlm-select-label>Asia</hlm-select-label>
					<hlm-option value="msk">Moscow Time (MSK)</hlm-option>
					<hlm-option value="ist">India Standard Time (IST)</hlm-option>
					<hlm-option value="cst_china">China Standard Time (CST)</hlm-option>
					<hlm-option value="jst">Japan Standard Time (JST)</hlm-option>
					<hlm-option value="kst">Korea Standard Time (KST)</hlm-option>
					<hlm-option value="ist_indonesia">Indonesia Central Standard Time (WITA)</hlm-option>
				</hlm-select-group>

				<hlm-select-group>
					<hlm-select-label>Australia & Pacific</hlm-select-label>
					<hlm-option value="awst">Australian Western Standard Time (AWST)</hlm-option>
					<hlm-option value="acst">Australian Central Standard Time (ACST)</hlm-option>
					<hlm-option value="aest">Australian Eastern Standard Time (AEST)</hlm-option>
					<hlm-option value="nzst">New Zealand Standard Time (NZST)</hlm-option>
					<hlm-option value="fjt">Fiji Time (FJT)</hlm-option>
				</hlm-select-group>

				<hlm-select-group>
					<hlm-select-label>South America</hlm-select-label>
					<hlm-option value="art">Argentina Time (ART)</hlm-option>
					<hlm-option value="bot">Bolivia Time (BOT)</hlm-option>
					<hlm-option value="brt">Brasilia Time (BRT)</hlm-option>
					<hlm-option value="clt">Chile Standard Time (CLT)</hlm-option>
				</hlm-select-group>

				<hlm-select-scroll-down/>
			</hlm-select-content>
		</hlm-select>
	\`,
})
export class SelectScrollablePreviewComponent {}`;
