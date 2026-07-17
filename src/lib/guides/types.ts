export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "h3"; text: string };

export type GuideSection = {
  id: string;
  title: string;
  blocks: GuideBlock[];
};

export type GuideCategory = "guide" | "pillar" | "compare" | "persona" | "freedom";

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: GuideCategory;
  /** Featured snippet bait — direct answer in 2-3 sentences. */
  directAnswer: string;
  /** Maps to FAQ accordion question for "Read full guide" links. */
  faqQuestion?: string;
  relatedSlugs: string[];
  pillarSlug?: string;
  sections: GuideSection[];
  productPitch: {
    title: string;
    paragraphs: string[];
  };
};

export type ComparePage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  competitor: string;
  directAnswer: string;
  relatedSlugs: string[];
  sections: GuideSection[];
  productPitch: {
    title: string;
    paragraphs: string[];
  };
};
