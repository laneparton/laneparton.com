declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"posts": {
"bun-release-a-step-towards-acquired.md": {
	id: "bun-release-a-step-towards-acquired.md";
  slug: "bun-release-a-step-towards-acquired";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"buzz-around-synthetic-data.md": {
	id: "buzz-around-synthetic-data.md";
  slug: "buzz-around-synthetic-data";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"chat-gpt-plus-astro-intregation.md": {
	id: "chat-gpt-plus-astro-intregation.md";
  slug: "chat-gpt-plus-astro-intregation";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"clean-commit-messages.md": {
	id: "clean-commit-messages.md";
  slug: "clean-commit-messages";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"convert-bookmarks-to-links-astro.md": {
	id: "convert-bookmarks-to-links-astro.md";
  slug: "convert-bookmarks-to-links-astro";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"creating-a-personal-assistant-llm.md": {
	id: "creating-a-personal-assistant-llm.md";
  slug: "creating-a-personal-assistant-llm";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"developerweek-2020-hackathon-research.md": {
	id: "developerweek-2020-hackathon-research.md";
  slug: "developerweek-2020-hackathon-research";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"developerweek-2020-thank-you-bay-area.md": {
	id: "developerweek-2020-thank-you-bay-area.md";
  slug: "developerweek-2020-thank-you-bay-area";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"drupalcon-reminding-us-to-all-stay-humble.md": {
	id: "drupalcon-reminding-us-to-all-stay-humble.md";
  slug: "drupalcon-reminding-us-to-all-stay-humble";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"gatsby-netlify-redirects-easy.md": {
	id: "gatsby-netlify-redirects-easy.md";
  slug: "gatsby-netlify-redirects-easy";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"hacking-together-my-new-portfolio.md": {
	id: "hacking-together-my-new-portfolio.md";
  slug: "hacking-together-my-new-portfolio";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"how-generative-ui-will-revolutionize-the-web.md": {
	id: "how-generative-ui-will-revolutionize-the-web.md";
  slug: "how-generative-ui-will-revolutionize-the-web";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"is-compassion-the-secret-ingredient-to-life.md": {
	id: "is-compassion-the-secret-ingredient-to-life.md";
  slug: "is-compassion-the-secret-ingredient-to-life";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"level-up-vue-with-eslint.md": {
	id: "level-up-vue-with-eslint.md";
  slug: "level-up-vue-with-eslint";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"my-venture-into-static-site-generators-jekyll.md": {
	id: "my-venture-into-static-site-generators-jekyll.md";
  slug: "my-venture-into-static-site-generators-jekyll";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"powering-in-app-help-with-llm.md": {
	id: "powering-in-app-help-with-llm.md";
  slug: "powering-in-app-help-with-llm";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"prettier-pre-commit-hooks-are-the-bomb.md": {
	id: "prettier-pre-commit-hooks-are-the-bomb.md";
  slug: "prettier-pre-commit-hooks-are-the-bomb";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"running-open-source-llm-models-on-centos-7.md": {
	id: "running-open-source-llm-models-on-centos-7.md";
  slug: "running-open-source-llm-models-on-centos-7";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"sage-9-wpengine.md": {
	id: "sage-9-wpengine.md";
  slug: "sage-9-wpengine";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"shadow-storybook-in-your-gatsby-project.md": {
	id: "shadow-storybook-in-your-gatsby-project.md";
  slug: "shadow-storybook-in-your-gatsby-project";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"the-pursuit-of-purpose.md": {
	id: "the-pursuit-of-purpose.md";
  slug: "the-pursuit-of-purpose";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"using-notion-as-a-website.md": {
	id: "using-notion-as-a-website.md";
  slug: "using-notion-as-a-website";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"visual-regression-testing-might-save-your-ass.md": {
	id: "visual-regression-testing-might-save-your-ass.md";
  slug: "visual-regression-testing-might-save-your-ass";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"what-im-looking-forward-to-at-developerweek-2020.md": {
	id: "what-im-looking-forward-to-at-developerweek-2020.md";
  slug: "what-im-looking-forward-to-at-developerweek-2020";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"what-should-a-real-world-vue-3-app-look-like.md": {
	id: "what-should-a-real-world-vue-3-app-look-like.md";
  slug: "what-should-a-real-world-vue-3-app-look-like";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"whos-really-putting-rag-to-work-in-production.md": {
	id: "whos-really-putting-rag-to-work-in-production.md";
  slug: "whos-really-putting-rag-to-work-in-production";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
};
"stream-notes": {
"1-20-24.md": {
	id: "1-20-24.md";
  slug: "1-20-24";
  body: string;
  collection: "stream-notes";
  data: InferEntrySchema<"stream-notes">
} & { render(): Render[".md"] };
"1-23-24.md": {
	id: "1-23-24.md";
  slug: "1-23-24";
  body: string;
  collection: "stream-notes";
  data: InferEntrySchema<"stream-notes">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"bookmarks": {
"bookmarks": {
	id: "bookmarks";
  collection: "bookmarks";
  data: any
};
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
