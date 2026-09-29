import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
ArrowLeft,
ArrowRight,
CheckCircle2,
Lightbulb,
PlayCircle,
XCircle,
} from "lucide-react";
import CodeBlock from "../components/CodeBlock";
import { patterns } from "../data/patterns";

const PatternDetail = () => {
const { id } = useParams();
const [scrollProgress, setScrollProgress] = useState(0);

const pattern = patterns.find((item) => item.id === id);

const currentIndex = useMemo(
() => patterns.findIndex((item) => item.id === id),
[id]
);

const previousPattern =
currentIndex > 0 ? patterns[currentIndex - 1] : null;

const nextPattern =
currentIndex >= 0 && currentIndex < patterns.length - 1
? patterns[currentIndex + 1]
: null;

useEffect(() => {
window.scrollTo({ top: 0, behavior: "smooth" });

const handleScroll = () => {
  const scrollTop = window.scrollY;
  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (documentHeight <= 0) {
    setScrollProgress(0);
    return;
  }

  const progress = (scrollTop / documentHeight) * 100;
  setScrollProgress(Math.min(progress, 100));
};

window.addEventListener("scroll", handleScroll);

handleScroll();

return () => {
  window.removeEventListener("scroll", handleScroll);
};


}, [id]);

if (!pattern) {
return ( <main className="min-h-screen bg-gray-50 px-4 py-20 dark:bg-gray-900"> <div className="mx-auto max-w-3xl text-center"> <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
Tasarım kalıbı bulunamadı </h1>

      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Aradığınız tasarım kalıbı mevcut değil veya kaldırılmış olabilir.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        <ArrowLeft size={18} />
        Ana sayfaya dön
      </Link>
    </div>
  </main>
);

}

return ( <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
<div
className="fixed left-0 top-0 z-50 h-1 bg-blue-600"
style={{ width: `${scrollProgress}%` }}
/>
  <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    <Link
      to="/"
      className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
    >
      <ArrowLeft size={18} />
      Tüm kalıplara dön
    </Link>

    <header className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
        {pattern.category}
      </span>

      <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
        {pattern.name}
      </h1>

      <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
        {pattern.description}
      </p>
    </header>

    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <PlayCircle className="text-blue-600 dark:text-blue-400" size={24} />

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Problem
        </h2>
      </div>

      <p className="mt-4 leading-8 text-gray-600 dark:text-gray-300">
        {pattern.problem}
      </p>
    </section>

    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <Lightbulb className="text-yellow-500" size={24} />

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ne Zaman Kullanılır?
        </h2>
      </div>

      <p className="mt-4 leading-8 text-gray-600 dark:text-gray-300">
        {pattern.whenToUse}
      </p>

      <div className="mt-8">
        <div className="flex items-center gap-3">
          <XCircle className="text-red-500" size={22} />

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Ne Zaman Kullanılmamalı?
          </h3>
        </div>

        <p className="mt-3 leading-8 text-gray-600 dark:text-gray-300">
          {pattern.whenNotToUse}
        </p>
      </div>
    </section>

    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gerçek Hayattan Örnek
        </h2>
      </div>

      <p className="mt-4 leading-8 text-gray-600 dark:text-gray-300">
        {pattern.realWorld}
      </p>
    </section>

    <section className="mt-8">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        C# Örneği
      </h2>

      <CodeBlock code={pattern.code} language="csharp" />
    </section>

    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Kodun Açıklaması
      </h2>

      <div className="mt-6 space-y-4">
        {pattern.explanation.map((item, index) => (
          <div
            key={index}
            className="flex gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-900"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {index + 1}
            </span>

            <p className="leading-7 text-gray-600 dark:text-gray-300">
              {item}
            </p>
          </div>
        ))}
      </div>
    </section>

    <section className="mt-8 grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-900/50 dark:bg-green-900/10">
        <h2 className="text-xl font-bold text-green-800 dark:text-green-300">
          Avantajları
        </h2>

        <ul className="mt-4 space-y-3">
          {pattern.pros.map((item, index) => (
            <li
              key={index}
              className="flex gap-3 text-green-900 dark:text-green-200"
            >
              <CheckCircle2 size={20} className="mt-1 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/10">
        <h2 className="text-xl font-bold text-red-800 dark:text-red-300">
          Dezavantajları
        </h2>

        <ul className="mt-4 space-y-3">
          {pattern.cons.map((item, index) => (
            <li
              key={index}
              className="flex gap-3 text-red-900 dark:text-red-200"
            >
              <XCircle size={20} className="mt-1 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Özet
      </h2>

      <p className="mt-4 leading-8 text-gray-600 dark:text-gray-300">
        {pattern.summary}
      </p>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          İlgili Kalıplar
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {pattern.related.map((relatedPattern) => (
            <span
              key={relatedPattern}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            >
              {relatedPattern}
            </span>
          ))}
        </div>
      </div>
    </section>

    <nav className="mt-10 grid gap-4 sm:grid-cols-2">
      {previousPattern ? (
        <Link
          to={`/pattern/${previousPattern.id}`}
          className="group rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <ArrowLeft size={16} />
            Önceki kalıp
          </span>

          <span className="mt-2 block font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {previousPattern.name}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {nextPattern ? (
        <Link
          to={`/pattern/${nextPattern.id}`}
          className="group rounded-xl border border-gray-200 bg-white p-5 text-right transition hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <span className="flex items-center justify-end gap-2 text-sm text-gray-500 dark:text-gray-400">
            Sonraki kalıp
            <ArrowRight size={16} />
          </span>

          <span className="mt-2 block font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {nextPattern.name}
          </span>
        </Link>
      ) : null}
    </nav>
  </article>
</main>

);
};

export default PatternDetail;
