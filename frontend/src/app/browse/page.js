"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  PackageSearch,
} from "lucide-react";

import ItemCard from "../../components/ItemCard";
import { apiRequest } from "../../lib/api";

const categories = [
  "All Categories",
  "Electronics",
  "Documents",
  "Accessories",
  "Clothing",
  "Books",
  "Keys",
  "Bags",
  "Other",
];

export default function BrowsePage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All Categories");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (type !== "All") {
        params.set("type", type);
      }

      if (category !== "All Categories") {
        params.set("category", category);
      }

      params.set("status", "active");

      const data = await apiRequest(`/items?${params.toString()}`);

      setItems(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError(err.message || "Unable to load items.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [search, type, category]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function clearFilters() {
    setSearch("");
    setType("All");
    setCategory("All Categories");
  }

  return (
    <div className="min-h-screen px-5 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Explore Campus Listings
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Browse Lost & Found Items
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            Search through items reported by students and help reconnect
            belongings with their owners.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by item name, description or location..."
              className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <SlidersHorizontal size={16} />
                Item Type
              </label>

              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="All">All Items</option>
                <option value="Lost">Lost Items</option>
                <option value="Found">Found Items</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                {categories.map((itemCategory) => (
                  <option key={itemCategory} value={itemCategory}>
                    {itemCategory}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results heading */}
        <div className="mt-9 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Available Listings
            </h2>

            {!loading && (
              <p className="mt-1 text-sm text-slate-500">
                {items.length} {items.length === 1 ? "item" : "items"} found
              </p>
            )}
          </div>

          <button
            onClick={fetchItems}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((number) => (
              <div
                key={number}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-48 bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="h-5 w-2/3 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">{error}</p>

            <button
              onClick={fetchItems}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Items */}
        {!loading && !error && items.length > 0 && (
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && items.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <PackageSearch
              size={55}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-5 text-xl font-bold text-slate-800">
              No items found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}