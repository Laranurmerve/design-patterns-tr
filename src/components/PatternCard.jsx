import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const PatternCard = ({ pattern }) => {
const categoryColors = {
Creational:
"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
Structural:
"bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
Behavioral:
"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
};

const categoryColor =
categoryColors[pattern.category] ||
"bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

return (
<Link
to={`/pattern/${pattern.id}`}
className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
> <div className="mb-4 flex items-start justify-between gap-4"> <div>
<span
className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${categoryColor}`}
>
{pattern.category} </span>

```
      <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
        {pattern.name}
      </h3>
    </div>

    <ChevronRight
      size={22}
      className="mt-1 shrink-0 text-gray-400 transition-transform duration-300 group-hover:translate-x-1"
    />
  </div>

  <p className="mb-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
    {pattern.description}
  </p>

  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
    Detayları incele
  </span>
</Link>


);
};

export default PatternCard;
