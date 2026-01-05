#!/usr/bin/env bun
/**
 * DuckDuckGo Search - No API key needed
 * Uses Bun's HTMLRewriter to parse results, Turndown for markdown
 */

import TurndownService from "turndown";

const query = process.argv[2];

if (!query) {
  console.error('Usage: bun search.ts "search query"');
  process.exit(1);
}

// Fetch from DuckDuckGo Lite
const response = await fetch("https://lite.duckduckgo.com/lite/", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  },
  body: new URLSearchParams({ q: query, kl: "us-en" }),
});

if (!response.ok) {
  console.error(`Search failed: ${response.status}`);
  process.exit(1);
}

const html = await response.text();

// Use HTMLRewriter to strip ads and junk
const rewriter = new HTMLRewriter()
  .on("script, style, noscript, input, form[action*='ad']", {
    element(el) { el.remove(); },
  })
  .on("[class*='ad'], [id*='ad']", {
    element(el) { el.remove(); },
  })
  // Remove ad/tracking links
  .on("a.result-link", {
    element(el) {
      const href = el.getAttribute("href") || "";
      if (href.includes("duckduckgo.com/y.js") || href.includes("ad_provider")) {
        el.remove();
      }
    },
  });

const cleaned = await rewriter.transform(new Response(html)).text();

// Extract results table
const resultsMatch = cleaned.match(/<table[^>]*>[\s\S]*?<\/table>/gi);
const resultsTable = resultsMatch?.find((t) => t.includes("result-link")) || "";

if (!resultsTable) {
  console.log("No results found.");
  process.exit(0);
}

// Convert to Markdown
const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
});

// Format result links
turndown.addRule("resultLinks", {
  filter: "a",
  replacement: (content, node) => {
    const href = (node as HTMLAnchorElement).getAttribute("href") || "";
    const text = content.trim();

    // Skip tracking/ad/empty links
    if (href.includes("duckduckgo.com/y.js") || !text || !href) {
      return "";
    }

    // Format as heading with URL below
    if ((node as HTMLElement).classList?.contains("result-link")) {
      return `\n### ${text}\n${href}\n`;
    }

    return text;
  },
});

// Format snippets
turndown.addRule("snippets", {
  filter: (node) =>
    node.nodeName === "TD" &&
    (node as HTMLElement).classList?.contains("result-snippet"),
  replacement: (content) => `${content.trim()}\n\n---\n`,
});

// Remove table noise
turndown.addRule("tableNoise", {
  filter: ["table", "tr", "td", "th", "thead", "tbody"],
  replacement: (content) => content,
});

const markdown = turndown.turndown(resultsTable);

// Clean up
const output = markdown
  .replace(/\n{3,}/g, "\n\n")
  .replace(/^\s*\d+\.\s*$/gm, "")
  .replace(/Sponsored.*?---/gs, "")
  .replace(/\[more info\].*?---/gs, "")
  .replace(/---\s*\d+\.\s*/g, "---\n\n")
  .replace(/^\s+/gm, "")
  .trim();

console.log(`# Search Results: "${query}"\n`);
console.log(output);
