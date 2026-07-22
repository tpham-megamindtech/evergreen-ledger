import Image from "next/image";
import Link from "next/link";
import { ArticleMeta } from "@/lib/content";
import { getCategory } from "@/lib/categories";

export default function Hero({ article }: { article: ArticleMeta }) {
  const category = getCategory(article.category);

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group grid overflow-hidden rounded-2xl border border-slate-200 shadow-lg lg:grid-cols-5 lg:items-stretch"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-brand-100 lg:col-span-3 lg:aspect-auto lg:min-h-[380px]">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-center gap-4 bg-brand-900 p-6 sm:p-10 lg:col-span-2">
        {category && (
          <span className="w-fit rounded-full bg-sound-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {category.name}
          </span>
        )}
        <h1 className="font-serif text-2xl font-bold leading-tight text-white sm:text-3xl">
          {article.title}
        </h1>
        <p className="text-sm text-brand-100 sm:text-base">{article.excerpt}</p>
        <span className="mt-2 inline-flex w-fit items-center gap-1 text-sm font-semibold text-sound-300 transition-colors group-hover:text-sound-200">
          Read the full story &rarr;
        </span>
      </div>
    </Link>
  );
}
