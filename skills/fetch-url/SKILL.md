---
name: fetch-url
description: Fetch a webpage and return its content as clean markdown. Use when you need to read article content, documentation, or any web page.
---

# Fetch URL

Fetches a webpage and extracts the main content as clean markdown. Uses Bun's HTMLRewriter to strip junk (scripts, nav, ads, etc.) and Turndown for markdown conversion.

## How to Use

```bash
~/.claude/skills/fetch-url/scripts/fetch.ts "https://example.com"
```

## When to Use

- User asks you to read or summarize a webpage
- You need to fetch documentation or article content
- Extracting information from a specific URL
- Reading blog posts, news articles, or reference pages

## Examples

```bash
~/.claude/skills/fetch-url/scripts/fetch.ts "https://developer.apple.com/documentation/foundationmodels"
~/.claude/skills/fetch-url/scripts/fetch.ts "https://anthropic.com/engineering/building-agents-with-the-claude-agent-sdk"
~/.claude/skills/fetch-url/scripts/fetch.ts "https://en.wikipedia.org/wiki/Swift_(programming_language)"
```

## Output

Returns the page content as clean markdown with:
- Main article content extracted (navigation, ads, etc. removed)
- Headings preserved
- Links converted to markdown format
- Code blocks maintained
- Metadata (title, author, description) included

## Tips

- Works best on article/documentation pages
- For dynamic JS-rendered pages, content may be limited
