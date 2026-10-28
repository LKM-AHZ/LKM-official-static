---
title: Static Site Content Policy
description: Rules for bilingual content, publication dates, factual corrections, and release checks
publishDate: 2026-08-27
image: /images/covers/announcement.webp
tags: [Official Website, Guides]
---

The Phientist static website has moved beyond its initial structure test and is now maintained
as a public information archive. Announcements, news, and introductory material are stored as
Markdown and published through a static build. This page explains how that content is created,
revised, and released, for both maintainers and contributors.

## Content Types and Locations

- **News** covers community changes, events, and project progress. It appears in the
  News & Updates tab of `/news` and the home page's recent updates.
- **Website and community** articles are long-lived pages such as Getting Started, the community
  introduction, and this policy. They omit `category` and appear under Website & Community.
- **Project and studio** articles set `category: project` or `category: studio` and appear in
  their own tabs.
- **Maintenance tutorials** explain how to work on the site itself, such as the
  [Editing Guide](/en/docs/editing-guide).

All articles live under `src/content/docs/<lang>/`, with Chinese in `zh/` and English in `en/`.
The Chinese and English versions of one article share the same filename; the route is derived
from that filename.

## Bilingual Pairs and Naming

- Chinese and English files keep the same filename, which makes gaps easy to spot.
- Titles, summaries, dates, and tags should agree in meaning, not word for word.
- Do not rename a published file casually. The filename is part of the URL, and a rename breaks
  old links.
- When adding important material, assess the English version at the same time. Do not publish
  placeholder copy while a translation is unfinished.

## Dates and Revisions

- `publishDate` records first publication, not the last edit.
- Factual corrections should add a "Revision note" at the end of the article with what changed
  and why. Do not change the date merely to make an old article look new.
- Historical news keeps the context in which it was written. For later developments, prefer a
  new article, or mark an update clearly in the original.
- Translation fixes, typo fixes, and layout edits can be made directly without a separate
  announcement.

## Facts, Sources, and Tone

- Claims about dates, places, people, figures, and organizational decisions must trace back to a
  source or a maintainer's confirmation.
- When something is uncertain, write "planned" or "to be announced" rather than filling the gap
  with confident detail.
- Separate facts, plans, and opinions. When citing outside research or reporting, link to an
  accessible primary source.
- Aim for clear, restrained prose. Avoid dramatic headlines and promises that cannot be kept.

## Images and Links

- Covers live in `public/images/covers/` with stable filenames, a 1200w main image, and an 800w
  thumbnail.
- Body images should also use local assets where possible. External images can fail because of
  hotlink protection, rate limits, or domain changes.
- Prefer official, durable external links, and check them periodically.
- Images need alternative text; decorative covers are handled by the shared component.

## Drafts, Placeholders, and Release

- Unfinished drafts must not appear in public lists as placeholder copy.
- Before publishing, run a local build and check both language routes, the table of contents,
  images, and in-article links.
- To change a historical fact, explain the evidence in the maintenance channel before merging
  the edit.
- Commands are documented in the [Editing Guide](/en/docs/editing-guide); deployment steps are
  in `DEPLOYMENT.md` at the repository root.

## Feedback and Privacy

To report an error, include the page URL, the location, and supporting evidence. Privacy,
security, or account incidents should be sent privately to maintainers rather than discussed
publicly.

Content maintenance is not reserved for a small group. If you are willing to stand behind your
words and respect facts and readers, you can start with one small article.

Further reading: [Getting Started](/en/docs/getting-started) ·
[Editing Guide](/en/docs/editing-guide)
