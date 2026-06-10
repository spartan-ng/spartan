import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';

@Component({
	selector: 'spartan-collapsible-rtl',
	imports: [HlmCollapsibleImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideChevronsUpDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-collapsible class="flex w-[350px] flex-col gap-2" [dir]="_dir()">
			<div class="flex items-center justify-between gap-4 px-4">
				<h4 class="text-sm font-semibold">{{ _t()['orderNumber'] }}</h4>
				<button hlmCollapsibleTrigger hlmBtn variant="ghost" size="icon" class="size-8">
					<ng-icon name="lucideChevronsUpDown" />
					<span class="sr-only">Toggle</span>
				</button>
			</div>
			<div class="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
				<span class="text-muted-foreground">{{ _t()['status'] }}</span>
				<span class="font-medium">{{ _t()['shipped'] }}</span>
			</div>
			<hlm-collapsible-content class="flex flex-col gap-2">
				<div class="rounded-md border px-4 py-2 text-sm">
					<p class="font-medium">{{ _t()['shippingAddress'] }}</p>
					<p class="text-muted-foreground">{{ _t()['address'] }}</p>
				</div>
				<div class="rounded-md border px-4 py-2 text-sm">
					<p class="font-medium">{{ _t()['items'] }}</p>
					<p class="text-muted-foreground">{{ _t()['itemsDescription'] }}</p>
				</div>
			</hlm-collapsible-content>
		</hlm-collapsible>
	`,
})
export class CollapsibleRtl {
	private readonly _language = inject(TranslateService).language;
	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				orderNumber: 'Order #4189',
				status: 'Status',
				shipped: 'Shipped',
				shippingAddress: 'Shipping address',
				address: '100 Market St, San Francisco',
				items: 'Items',
				itemsDescription: '2x Studio Headphones',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				orderNumber: 'الطلب #4189',
				status: 'الحالة',
				shipped: 'تم الشحن',
				shippingAddress: 'عنوان الشحن',
				address: '100 Market St, San Francisco',
				items: 'العناصر',
				itemsDescription: '2x سماعات الاستوديو',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				orderNumber: 'הזמנה #4189',
				status: 'סטטוס',
				shipped: 'נשלח',
				shippingAddress: 'כתובת משלוח',
				address: '100 Market St, San Francisco',
				items: 'פריטים',
				itemsDescription: '2x אוזניות סטודיו',
			},
		},
	};
	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
