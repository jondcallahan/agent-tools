---
name: web-search
description: Search the web for up to date information. Use this skill when the user requests local or up to date information.
---

# Web Search

Search the web using Exa for up-to-date information beyond your knowledge cutoff.

## How to Use

```bash
~/.claude/skills/web-search/scripts/web-search.ts "your search query"
```

## Configuration

Create a `.env.local` file in the `scripts/` directory with your Exa API key:

```
EXA_API_KEY=your-api-key-here
```

Get an API key at https://exa.ai

## When to Use

- User asks about current events, news, or recent developments
- User needs up-to-date pricing, availability, or status information
- User asks about local businesses, services, or locations
- User wants to verify recent facts or statistics
- Information likely changed since your knowledge cutoff
- User explicitly asks to search the web

## Examples

```bash
~/.claude/skills/web-search/scripts/web-search.ts "latest news on AI regulations 2024"
~/.claude/skills/web-search/scripts/web-search.ts "best coffee shops in San Francisco"
~/.claude/skills/web-search/scripts/web-search.ts "Next.js 15 new features"
```

## Output

Returns JSON with search results including titles, URLs, and snippets. Parse results to answer the user's question and cite sources.

## Tips

- Be specific with queries for better results
- Include context like dates, locations, or versions
