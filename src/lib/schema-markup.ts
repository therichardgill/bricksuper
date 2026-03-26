/**
 * JSON-LD Schema Markup Generators
 *
 * Generates structured data for FAQ, How-To, Article, and Organization
 * schemas. Injected into <head> via Next.js metadata or script tags.
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(items: FAQItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  wordCount?: number;
}

export function generateArticleSchema(input: ArticleSchemaInput): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    wordCount: input.wordCount,
    author: {
      "@type": "Organization",
      name: "BrickSuper",
      url: "https://bricksuper.com.au",
    },
    publisher: {
      "@type": "Organization",
      name: "BrickSuper",
      url: "https://bricksuper.com.au",
    },
  };
}

export function generateOrganizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BrickSuper",
    url: "https://bricksuper.com.au",
    description:
      "Educational information about SMSF property investment in Australia.",
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
