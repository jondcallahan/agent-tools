---
name: fetch-url
description: Fetch a webpage and return its content as clean markdown. Use when you need to read article content, documentation, or any web page.
---

# Fetch URL

Fetches a webpage and extracts the main readable content as clean markdown. Uses Mozilla Readability (same as Firefox Reader View) to extract content, then Turndown for markdown conversion.

## How to Use

```bash
bun ~/.claude/skills/fetch-url/scripts/fetch.ts "https://example.com"
```

## When to Use

- User asks you to read or summarize a webpage
- You need to fetch documentation or article content
- Extracting information from a specific URL
- Reading blog posts, news articles, or reference pages

## Examples

```bash
bun ~/.claude/skills/fetch-url/scripts/fetch.ts "https://developer.apple.com/documentation/foundationmodels"
bun ~/.claude/skills/fetch-url/scripts/fetch.ts "https://anthropic.com/engineering/building-agents-with-the-claude-agent-sdk"
bun ~/.claude/skills/fetch-url/scripts/fetch.ts "https://en.wikipedia.org/wiki/Swift_(programming_language)"
```

## Output

Returns the page content as clean markdown with:
- Main article content extracted (navigation, ads, etc. removed)
- Headings preserved
- Links converted to markdown format
- Code blocks maintained
- Metadata (title, author, excerpt) included

## Tips

- Works best on article/documentation pages
- For dynamic JS-rendered pages, content may be limited
- Uses the same algorithm as Firefox Reader View
