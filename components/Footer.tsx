import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-brand-900 text-brand-100">
      <div className="treeline-divider" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <span className="font-serif text-xl font-bold text-white">
              Evergreen Ledger
            </span>
            <p className="mt-2 max-w-xs text-sm text-brand-300">
              Beauty, finance, business, education, and healthcare news from
              across Washington State.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-sound-300">
              Categories
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-brand-200 transition-colors hover:text-sound-300"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-700 pt-6 text-xs text-brand-400">
          &copy; {year} Evergreen Ledger. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
