export const metaWith = (title: string, description: string) => [
	{
		name: 'description',
		content: description,
	},
	{
		name: 'author',
		content: 'Robin Goetz',
	},
	{
		property: 'og:title',
		content: title,
	},
	{
		property: 'og:site_name',
		content: 'SPARTAN',
	},
	{
		property: 'og:type',
		content: 'website',
	},
	{
		property: 'og:url',
		content: 'https://spartan.ng/',
	},
	{
		property: 'og:description',
		content: description,
	},
	{
		property: 'og:image',
		content: 'https://spartan.ng/assets/og-image.png',
	},

	{
		property: 'twitter:card',
		content: 'summary_large_image',
	},
	{
		property: 'twitter:title',
		content: title,
	},
	{
		property: 'twitter:description',
		content: description,
	},
	{
		property: 'twitter:image',
		content: 'https://spartan.ng/assets/og-image.png',
	},
];
