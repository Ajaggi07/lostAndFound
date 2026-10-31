"use client";

const categories = [
  "All",
  "Electronics",
  "Books",
  "Accessories",
  "Personal Items",
  "Keys",
  "Other",
];

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            selected === category
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 hover:bg-blue-50"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}