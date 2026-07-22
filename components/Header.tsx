import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

function PineMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7 text-brand-600"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 1.5l4.5 7.2h-2.4l4.2 6.6h-2.7l4.4 6.7H4l4.4-6.7H5.7l4.2-6.6H7.5L12 1.5z" />
      <rect x="10.6" y="21" width="2.8" height="2.2" />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2">
            <PineMark />
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-800 sm:text-3xl">
              Evergreen Ledger
            </span>
            <span className="hidden rounded-full bg-sound-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-sound-700 sm:inline">
              Washington
            </span>
          </Link>
        </div>

        <nav className="-mx-1 flex flex-wrap gap-x-1 gap-y-1 overflow-x-auto text-sm font-semibold">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
          >
            Home
          </Link>
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="treeline-divider" />
    </header>
  );
}
