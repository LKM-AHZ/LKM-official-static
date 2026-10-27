---
title: Editing Guide
description: The full path from creating a Markdown file and filling in metadata to local preview, bilingual review, and release
publishDate: 2026-10-17
image: /images/covers/editing-guide.webp
tags: [Official Website, Guides]
---

This guide is for members contributing to the website for the first time. It is not a complete
Markdown tutorial. Its goal is to help you finish one publishable article independently: put the
file in the right place, fill in the metadata, structure the body clearly, keep the two languages
aligned, and pass the build checks.

> If you are unsure about a step, change it locally and run the build first. Do not push
> unverified content straight to the main branch.

## Start With the Directory and Filenames

Articles live under `src/content/docs/`, separated by language:

```text
src/content/docs/
├── zh/
│   ├── intro.md
│   ├── getting-started.md
│   └── ...
└── en/
    ├── intro.md
    ├── getting-started.md
    └── ...
```

Rules:

- Chinese goes in `zh/`, English in `en/`; do not mix them.
- Both versions of one article use the same filename. `zh/editing-guide.md` pairs with
  `en/editing-guide.md`.
- The filename is part of the URL: `editing-guide.md` becomes `/zh/docs/editing-guide`. Do not
  rename a published article casually, or old links will break.
- Use lowercase English letters, digits, and hyphens (kebab-case). Avoid spaces, Chinese
  characters, and underscores.
- One article per `.md` or `.mdx` file. Do not put several articles in one file.

## Frontmatter, Field by Field

Every article starts with frontmatter between two `---` lines:

```yaml
---
title: Article title
description: One-sentence summary for lists, search, and share cards
publishDate: 2026-10-17
category: news
tags: [Official Announcements]
image: /images/covers/example.webp
lang: en
---
```

| Field         | Required | Notes                                                                         |
| ------------- | -------- | ----------------------------------------------------------------------------- |
| `title`       | Yes      | The article title. Do not add an h1 in the body.                              |
| `description` | No       | Recommended; 40–80 characters is a good target. Used in lists and search.     |
| `publishDate` | Yes      | First publication date in `YYYY-MM-DD`. Do not change it for revisions.       |
| `category`    | No       | `news`, `project`, or `studio`; leave empty for Website & Community articles. |
| `tags`        | No       | One or more tags from the fixed groups below; do not invent new tags.         |
| `image`       | No       | Cover path beginning with `/` or `http(s)://`. Prefer a local asset.          |
| `lang`        | No       | Optional fallback marker. The real language comes from the directory.         |

### Dates and Categories

- `publishDate` is the first publication date, not the last edit.
- Add `category: news` for news, `project` for project posts, and `studio` for studio posts.
  Website, community, guide, and maintenance articles omit `category`; otherwise they will
  appear in the news or project/studio tab.
- Typo fixes, link fixes, and layout edits do not need a new date. If the change is factual, add
  a revision note at the end.

### Tags

Tags are light categories, not a keyword dump. They are grouped by tab, and an article may use
one or more of the closest tags — but do not invent new ones:

- **News & Updates**: Official Announcements, Events, Team Recruitment, Donation Disclosures,
  Partnerships
- **Website & Community**: Official Website, Community, Guides, Operations, Updates,
  Team Recruitment
- **Projects**: lkm-bot, Science Outreach Program, Public Benefit Program
- **Studios**: Full-Chain Tech Services Studio, Star Orbit Tutoring Studio

### Cover Images

If you provide `image`, put local files in `public/images/covers/` and prepare both:

- `<name>.webp`: the 1200w main image used on the article page.
- `<name>-800w.webp`: the 800w thumbnail used in lists and on mobile.

The frontmatter references only the main image:

```yaml
image: /images/covers/example.webp
```

The component derives the `-800w` thumbnail automatically. An article can be published without
a cover; the page falls back to a title-based gradient, so there will not be a blank space.

## Body Structure

The page title is rendered from `title` as an `<h1>`, so the body starts at level two:

```md
## A Main Section

Body paragraph.

### A Smaller Section

- List item
- List item

> A callout for something that needs emphasis.
```

Guidelines:

- Use `##` for main sections and `###` only when a section truly needs splitting. `####` is
  available, but do not go deeper.
- Keep headings short and specific, so the table of contents explains the article on its own.
- One idea per paragraph; split long paragraphs into two or three.
- Use lists for steps, parallel items, and checklists, not for the entire article.
- Put code, commands, and frontmatter in fenced code blocks with a language tag.
- Tables work for field descriptions and comparisons; do not use them for long prose.
- End with "Related reading" or "Further reading" linking to other articles in the same language.

## Internal and External Links

Internal links use full site paths with the language prefix:

```md
[Getting Started](/en/docs/getting-started)
[Articles](/en/news)
```

Chinese articles use `/zh/...` instead. Avoid relative paths such as `../getting-started`; they
break when routes change.

Prefer official, durable external links, and say what the reader will find:

```md
[The original paper](https://example.org/paper)
```

Do not paste a bare URL; readers should know what they are clicking. When citing an outside
conclusion, include the publishing organization and date where possible.

## Creating a New Article

### 1. Choose a slug

Use a short English phrase that captures the topic, such as `editing-guide` or
`summer-event-notes`. Once published, treat the slug as a stable URL; do not rename it just to
change the title.

### 2. Create both language files

Create one file with the same name in `zh/` and `en/`. If the English version is not ready, do
not copy the Chinese text as a placeholder. Either wait for the translation or do not publish
yet.

### 3. Fill in the frontmatter

Start from the template above and confirm at least `title`, `description`, `publishDate`, and
`tags`. News needs `category: news`; project and studio posts use `project` and `studio`
respectively.

### 4. Write the body and link it

Explain why the article exists, what happened, and what the reader should take away. Then add
background and further reading. Link to related articles at the end so readers can continue.

### 5. Preview locally

For a first contribution, install dependencies:

```sh
pnpm install
pnpm dev
```

The default address is `http://127.0.0.1:4321`. Open:

- Chinese: `http://127.0.0.1:4321/zh/docs/<slug>/`
- English: `http://127.0.0.1:4321/en/docs/<slug>/`

If the port is taken, use another:

```sh
pnpm dev -- --port 4322
```

Check at least:

- Title, summary, date, and tags are correct.
- The table of contents lists the expected level-two to level-four headings.
- Both language pages open, and in-article links stay in the right language.
- The layout works at mobile width.
- Text and highlights are readable in both day and night themes.

### 6. Check before committing

```sh
pnpm check
pnpm test
pnpm build
```

All three should pass. `pnpm build` generates every language route and catches problems beyond
frontmatter, images, and links.

### 7. Commit and deploy

Use a message that explains the change:

```text
docs: expand getting-started and add editing guide
```

Deployment steps are in `DEPLOYMENT.md` at the repository root. Even for content-only changes,
run a full build before merging.

## Bilingual Maintenance

Bilingual writing is not word-for-word translation; it is the same story told clearly in two
languages. Suggestions:

- Write one language first, confirm the structure and facts, then translate.
- Keep titles, summaries, dates, and tags aligned in meaning. Do not write "planned" in one
  language and "confirmed" in the other.
- Keep proper nouns consistent: 理科迷 / PHIENTIST, 七月团队 / July Team, 活动策划部 /
  Event Planning Office.
- Use full-width punctuation in Chinese and half-width punctuation in English; do not mix
  Chinese punctuation into English sentences.
- Avoid literal long sentences in English; prefer short sentences and active voice.
- Point each language's internal links to `/zh/...` or `/en/...` as appropriate. Do not send
  readers to the wrong language.

## Revisions and Historical Articles

- **Corrections**: keep `publishDate` and add a revision note at the end saying what changed and
  why.
- **Additions**: to add background or a later development, add a section and mark it
  "Updated YYYY-MM-DD".
- **Changed conclusions**: if new information overturns the original judgment, prefer a new
  article explaining the change, and link to it from the old one, rather than quietly editing
  the old conclusion.
- **Historical news**: keep the context and wording of the time. Do not rewrite events to fit a
  current message; use a "Later development" section or a new article.

## Pre-Publish Checklist

- [ ] Chinese and English files share a name and sit in `zh/` and `en/`.
- [ ] `title`, `description`, and `publishDate` are complete; the `category` matches the tab.
- [ ] The body starts at `##` and heading levels do not skip.
- [ ] Internal links use the correct language prefix and resolve.
- [ ] No "TODO", "TBD", or placeholder text appears on a public page.
- [ ] Covers and body images exist, with paths starting at `/`.
- [ ] `pnpm check`, `pnpm test`, and `pnpm build` pass.
- [ ] Spot-check the Chinese and English pages, mobile width, and night theme.

## Common Problems

**The article is missing from `/news`.**  
Check that `category` is `news`, `project`, or `studio` as intended, and that the file is in the
right language directory. Website, community, guide, and maintenance articles should omit
`category`; they appear under Website & Community.

**The table of contents is empty.**  
It only collects level-two to level-four headings. If the body is all paragraphs, or headings
use `#`, there is nothing to list.

**The cover does not appear.**  
Check that `image` starts with `/` or `http(s)://`, the file is in `public/images/covers/`, and
the 800w thumbnail exists.

**The build fails.**  
Read the file named in the error. Common causes are an invalid `publishDate`, a misspelled
`category`, a missing `title`, or a duplicate slug in the same language.

**The English page still contains Chinese.**  
That section is untranslated, or the Chinese file was copied into `en/`. Search for Chinese
characters before publishing.

## Related Reading

- [Getting Started](/en/docs/getting-started)
- [Content Policy](/en/docs/announcement)
- [Welcome to Phientist](/en/docs/intro)
