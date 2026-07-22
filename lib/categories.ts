export type CategorySlug =
  | "beauty-wellness"
  | "finance-economy"
  | "business-leaders"
  | "education"
  | "healthcare";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

// Display order is intentional: Beauty & Wellness leads the homepage,
// followed by Finance & Economy, Business Leaders, Education, Healthcare.
export const CATEGORIES: Category[] = [
  {
    slug: "beauty-wellness",
    name: "Beauty & Wellness",
    description: "Spas, salons, and wellness trends from Seattle to Spokane.",
  },
  {
    slug: "finance-economy",
    name: "Finance & Economy",
    description: "Banking, markets, and the economic pulse of Washington State.",
  },
  {
    slug: "business-leaders",
    name: "Business Leaders",
    description: "Founders and executives shaping the Evergreen State.",
  },
  {
    slug: "education",
    name: "Education",
    description: "Schools, colleges, and universities across Washington.",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    description: "Hospitals, clinics, and health care news statewide.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
