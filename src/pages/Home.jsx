import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PatternCard from "../components/PatternCard";
import { patterns } from "../data/patterns";

const Home = () => {
const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("All");

const categories = [
"All",
...new Set(patterns.map((pattern) => pattern.category)),
];

const filteredPatterns = useMemo(() => {
const search = searchTerm.toLowerCase().trim();

return patterns.filter((pattern) => {
  const matchesCategory =
    selectedCategory === "All" ||
    pattern.category === selectedCategory;

  const matchesSearch =
    search === "" ||
    pattern.name.toLowerCase().includes(search) ||
    pattern.description.toLowerCase().includes(search) ||
    pattern.problem.toLowerCase().includes(search);

  return matchesCategory && matchesSearch;
});

}, [searchTerm, selectedCategory]);

return ( <main className="min-h-screen bg-gray-50 dark:bg-gray-900"> <section className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"> <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"> <div className="mx-auto max-w-3xl text-center"> <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
C# Design Patterns </p>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Tasarım Kalıplarını Öğren
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Design Patterns konusunu Türkçe açıklamalar, gerçek hayat
          örnekleri ve C# kodlarıyla öğren.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tasarım kalıbı ara..."
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {categories.map((category) => {
          const isActive = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {category === "All" ? "Tümü" : category}
            </button>
          );
        })}
      </div>
    </div>
  </section>

  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Tasarım Kalıpları
      </h2>

      <span className="text-sm text-gray-500 dark:text-gray-400">
        {filteredPatterns.length} kalıp
      </span>
    </div>

    {filteredPatterns.length > 0 ? (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatterns.map((pattern) => (
          <PatternCard key={pattern.id} pattern={pattern} />
        ))}
      </div>
    ) : (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-300">
          Aramanızla eşleşen bir tasarım kalıbı bulunamadı.
        </p>
      </div>
    )}
  </section>
</main>

);
};

export default Home;
