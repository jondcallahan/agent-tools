---
name: ddg-search
description: Search the web using DuckDuckGo. Free, no API key required. Use when you need current information, news, prices, or facts.
---

# DuckDuckGo Web Search

Search the web using DuckDuckGo Lite. No API key needed, privacy-friendly, low chance of being blocked.

## How to Use

```bash
~/.claude/skills/ddg-search/scripts/search.ts "your search query"
```

## When to Use

- User asks about current events, news, or recent developments
- User needs up-to-date pricing, availability, or status information
- User wants to verify recent facts or statistics
- Information likely changed since your knowledge cutoff
- User explicitly asks to search the web

## Examples

```bash
~/.claude/skills/ddg-search/scripts/search.ts "latest Apple news January 2026"
~/.claude/skills/ddg-search/scripts/search.ts "macbook pro m4 price"
~/.claude/skills/ddg-search/scripts/search.ts "claude agent sdk documentation"
```

## Output

Returns top 10 search results with:
- Title
- URL
- Snippet/description

## Tips

- Be specific with queries for better results
- Include dates for time-sensitive queries
- Add "site:domain.com" to search within a specific site
