---
title: A New Phientist Website Goes Live
description: A more robust rebuild that tidies content, entry points, and the reading experience
publishDate: 2026-08-01
category: news
image: /images/covers/lkm-site-launch.webp
tags: [Official Announcements]
lang: en
---

## A Steadier New Start

This relaunch puts stability first. After the earlier data incident, we began treating
"write → publish → keep it safe" as one chain: pages and documents are generated as static files
at build time and served directly; images and other assets ship with the site as static
resources; notes are kept in Markdown; and the key directories now hold a second, off-site copy.
Even if something happens again, we can get back on our feet quickly.

We also tidied the entry points — intro, resources, team and docs now sit in one clear layer,
instead of being scattered and hard to find.

## What Changed

The most visible change is that content and pages are now separate. Articles no longer live in
temporary pages or chat logs; they are Markdown files in the repository, and the build turns them
into pages. The trade-off is one more check before publishing. What we get back is content that
can be traced, backed up, and rolled back.

The site also has a clearer structure: the home page explains who we are and what is new;
`/news` is for browsing by date; article pages are for reading over time; team and resources
pages hold organizational information. Each entry point does one job, so the navigation is
shorter than before.

## The Reading Experience

Article pages now have a table of contents built from the rendered level-two to level-four
headings; it follows your scroll and highlights the current section. The list page supports
search and tag filters. Articles show a publication date and an estimated reading time, and
previous/next links let you keep reading in order.

Mobile and desktop share the same content, with only the layout and navigation adapted.
Day/night themes, back-to-top, and share cards were filled in as well. The goal is to let reading
a single article happen with less friction.

## Polish as a Daily Habit

A community site becomes reliable through steady iteration, not a launch-day promise. So our
rhythm is simple: small changes ship often, bigger additions land on a schedule, and navigation
keeps adapting to real usage.

Rather than "stay tuned," we'd rather hear "this could be better." Tell us via the feedback
corner or official groups — and we'll fix the parts that get in your way.

## What Comes Next

Launch is a starting point. We will keep filling out the community introduction, usage guides,
and maintenance documentation, and turn event and project records into articles that can be
cited over time. If you are new, start with [Getting Started](/en/docs/getting-started). If you
want to help with content, read the [Editing Guide](/en/docs/editing-guide).

If an old link is broken, a page misaligns on your device, or an explanation is unclear, send
the URL and a screenshot to the maintainers. Every reproducible report becomes the basis for the
next small fix.
