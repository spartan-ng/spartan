import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-scrollable-preview',
	imports: [HlmSelectImports],
	template: `
		<hlm-select>
			<hlm-select-trigger class="w-[280px]">
				<span hlmSelectValue></span>
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal class="max-h-96 min-w-[325px]">
				<hlm-select-group>
					<hlm-select-label>North America</hlm-select-label>
					<hlm-select-item value="est">Eastern Standard Time (EST)</hlm-select-item>
					<hlm-select-item value="cst">Central Standard Time (CST)</hlm-select-item>
					<hlm-select-item value="mst">Mountain Standard Time (MST)</hlm-select-item>
					<hlm-select-item value="pst">Pacific Standard Time (PST)</hlm-select-item>
					<hlm-select-item value="akst">Alaska Standard Time (AKST)</hlm-select-item>
					<hlm-select-item value="hst">Hawaii Standard Time (HST)</hlm-select-item>
				</hlm-select-group>

				<hlm-select-group>
					<hlm-select-label>Europe & Africa</hlm-select-label>
					<hlm-select-item value="gmt">Greenwich Mean Time (GMT)</hlm-select-item>
					<hlm-select-item value="cet">Central European Time (CET)</hlm-select-item>
					<hlm-select-item value="eet">Eastern European Time (EET)</hlm-select-item>
					<hlm-select-item value="west">Western European Summer Time (WEST)</hlm-select-item>
					<hlm-select-item value="cat">Central Africa Time (CAT)</hlm-select-item>
					<hlm-select-item value="eat">East Africa Time (EAT)</hlm-select-item>
				</hlm-select-group>

				<hlm-select-group>
					<hlm-select-label>Asia</hlm-select-label>
					<hlm-select-item value="msk">Moscow Time (MSK)</hlm-select-item>
					<hlm-select-item value="ist">India Standard Time (IST)</hlm-select-item>
					<hlm-select-item value="cst_china">China Standard Time (CST)</hlm-select-item>
					<hlm-select-item value="jst">Japan Standard Time (JST)</hlm-select-item>
					<hlm-select-item value="kst">Korea Standard Time (KST)</hlm-select-item>
					<hlm-select-item value="ist_indonesia">Indonesia Central Standard Time (WITA)</hlm-select-item>
				</hlm-select-group>

				<hlm-select-group>
					<hlm-select-label>Australia & Pacific</hlm-select-label>
					<hlm-select-item value="awst">Australian Western Standard Time (AWST)</hlm-select-item>
					<hlm-select-item value="acst">Australian Central Standard Time (ACST)</hlm-select-item>
					<hlm-select-item value="aest">Australian Eastern Standard Time (AEST)</hlm-select-item>
					<hlm-select-item value="nzst">New Zealand Standard Time (NZST)</hlm-select-item>
					<hlm-select-item value="fjt">Fiji Time (FJT)</hlm-select-item>
				</hlm-select-group>

				<hlm-select-group>
					<hlm-select-label>South America</hlm-select-label>
					<hlm-select-item value="art">Argentina Time (ART)</hlm-select-item>
					<hlm-select-item value="bot">Bolivia Time (BOT)</hlm-select-item>
					<hlm-select-item value="brt">Brasilia Time (BRT)</hlm-select-item>
					<hlm-select-item value="clt">Chile Standard Time (CLT)</hlm-select-item>
				</hlm-select-group>
			</hlm-select-content>
		</hlm-select>
	`,
})
export class SelectScrollablePreview {}
