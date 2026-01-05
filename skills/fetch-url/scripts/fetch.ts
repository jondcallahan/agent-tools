#!/usr/bin/env bun
/**
 * Fetch URL - Convert any webpage to clean markdown
 * Uses Bun's HTMLRewriter to extract content, Turndown for markdown
 */

import TurndownService from "turndown";

const url = process.argv[2];

if (!url) {
  console.error('Usage: bun fetch.ts "https://example.com"');
  process.exit(1);
}

// Validate URL
let parsedUrl: URL;
try {
  parsedUrl = new URL(url);
} catch {
  console.error("Invalid URL:", url);
  process.exit(1);
}

// Fetch the page
const response = await fetch(url, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
  },
});

if (!response.ok) {
  console.error(`Failed to fetch: ${response.status} ${response.statusText}`);
  process.exit(1);
}

const html = await response.text();

// Extract metadata
let title = "";
let description = "";
let author = "";

const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
if (titleMatch) title = titleMatch[1].trim();

const descMatch = html.match(
  /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
) || html.match(
  /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i
);
if (descMatch) description = descMatch[1].trim();

const authorMatch = html.match(
  /<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i
);
if (authorMatch) author = authorMatch[1].trim();

// Use HTMLRewriter to strip non-content elements
const rewriter = new HTMLRewriter()
  // Remove scripts, styles, and non-content elements
  .on("script, style, noscript, iframe, svg, canvas, template, picture", {
    element(el) { el.remove(); },
  })
  // Remove navigation and page chrome
  .on("nav, header, footer, aside, menu, [role='navigation'], [role='banner'], [role='contentinfo'], [role='menu']", {
    element(el) { el.remove(); },
  })
  // Remove skip/jump links
  .on("[class*='skip'], [id*='skip'], a[href^='#']:not([href='#'])", {
    element(el) { el.remove(); },
  })
  // Remove ads and tracking
  .on("[class*='ad-'], [class*='ads-'], [class*='advert'], [id*='ad-'], [class*='sponsor'], [class*='promo']", {
    element(el) { el.remove(); },
  })
  // Remove social/share widgets
  .on("[class*='share'], [class*='social'], [class*='follow']", {
    element(el) { el.remove(); },
  })
  // Remove comments
  .on("[class*='comment'], [id*='comment'], #disqus_thread", {
    element(el) { el.remove(); },
  })
  // Remove popups and modals
  .on("[class*='cookie'], [class*='newsletter'], [class*='popup'], [class*='modal'], [class*='overlay']", {
    element(el) { el.remove(); },
  })
  // Remove hidden elements
  .on("[hidden], [aria-hidden='true']", {
    element(el) { el.remove(); },
  })
  // Remove forms
  .on("form, input, button, select, textarea", {
    element(el) { el.remove(); },
  })
  // Remove related/sidebar content
  .on("[class*='related'], [class*='recommended'], [class*='sidebar'], [class*='widget']", {
    element(el) { el.remove(); },
  });

const cleaned = await rewriter.transform(new Response(html)).text();

// Try to extract main content area, fallback to body
let content = cleaned;
const mainMatch = cleaned.match(/<(main|article)[^>]*>([\s\S]*?)<\/\1>/i);
if (mainMatch) {
  content = mainMatch[0];
} else {
  const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    content = bodyMatch[1];
  }
}

// Setup Turndown
const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
});

// Preserve code blocks
turndown.addRule("pre", {
  filter: "pre",
  replacement: (content, node) => {
    const el = node as HTMLElement;
    const code = el.querySelector?.("code");
    const lang = code?.className?.match(/language-(\w+)/)?.[1] || "";
    const text = code?.textContent || el.textContent || content;
    return `\n\`\`\`${lang}\n${text.trim()}\n\`\`\`\n`;
  },
});

// Make links absolute
turndown.addRule("absoluteLinks", {
  filter: "a",
  replacement: (content, node) => {
    let href = (node as HTMLAnchorElement).getAttribute("href") || "";
    const text = content.trim();

    if (!text || href.startsWith("javascript:")) {
      return text;
    }
    
    if (href.startsWith("#")) {
      return text; // Skip anchor links
    }

    // Make relative URLs absolute
    if (href && !href.startsWith("http")) {
      try {
        href = new URL(href, parsedUrl.origin).href;
      } catch {
        return text;
      }
    }

    return `[${text}](${href})`;
  },
});

// Convert to markdown
let markdown = turndown.turndown(content);

// Clean up
markdown = markdown
  .replace(/\n{3,}/g, "\n\n")
  .replace(/^\s+$/gm, "")
  .replace(/^-\s*$/gm, "")
  .replace(/!\[\]\([^)]+\)/g, "") // Remove images without alt
  .trim();

// Output with metadata
console.log(`# ${title || parsedUrl.hostname}\n`);
console.log(`**URL:** ${url}`);
if (author) console.log(`**Author:** ${author}`);
if (description) console.log(`**Description:** ${description}`);
console.log(`\n---\n`);
console.log(markdown);
