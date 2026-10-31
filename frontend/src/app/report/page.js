"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PackagePlus,
  MapPin,
  CalendarDays,
  FileText,
  Tag,
  ArrowLeft,
  Send,
} from "lucide-react";

import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import ImageUpload from "../../components/ImageUpload";
import { apiRequest } from "../../lib/api";

const categories = [
  "Electronics",
  "Documents",
  "Accessories",
  "Clothing",
  "Books",
  "Keys",
  "Bags",
  "Other",
];

function ReportForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    type: "Lost",
    category: "Electronics",
    description: "",
    location: "",
    date: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim() ||
      !form.date
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.title.trim().length < 3) {
      setError("Item title must contain at least 3 characters.");
      return;
    }

    if (form.description.trim().length < 10) {
      setError("Please provide a more detailed description.");
      return;
    }

    const formData = new FormData();

    formData.append("title", form.title.trim());
    formData.append("type", form.type);
    formData.append("category", form.category);
    formData.append("description", form.description.trim());
    formData.append("location", form.location.trim());
    formData.append("date", form.date);

    if (image) {
      formData.append("image", image);
    }

    setLoading(true);

    try {
      await apiRequest("/items", {
        method: "POST",
        body: formData,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to submit your report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-5 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/browse"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Browse
        </Link>

        {/* Heading */}
        <div className="mb-9">
          <div className="inline-flex rounded-2xl bg-blue-100 p-4 text-blue-600">
            <PackagePlus size={30} />
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-slate-900">
            Report an Item
          </h1>

          <p className="mt-3 leading-7 text-slate-500">
            Share the details of an item you have lost or found.
            Your report can help reconnect belongings with their owners.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Report Type */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              What are you reporting?
            </label>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    type: "Lost",
                  }))
                }
                className={`rounded-xl border-2 p-4 text-left transition ${
                  form.type === "Lost"
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className="block font-bold text-red-600">
                  Lost Item
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  I have lost something.
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    type: "Found",
                  }))
                }
                className={`rounded-xl border-2 p-4 text-left transition ${
                  form.type === "Found"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className="block font-bold text-emerald-600">
                  Found Item
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  I have found something.
                </span>
              </button>
            </div>
          </div>

          {/* Item Title */}
          <div className="mt-7">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Item Name *
            </label>

            <div className="relative">
              <PackagePlus
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: Black Wallet, Student ID Card"
                maxLength={100}
                required
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Category */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Category *
            </label>

            <div className="relative">
              <Tag
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description *
            </label>

            <div className="relative">
              <FileText
                size={18}
                className="absolute left-3 top-4 text-slate-400"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                maxLength={1000}
                required
                placeholder="Describe the item, including its colour, brand and other useful identifying details."
                className="w-full resize-none rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <p className="mt-1 text-right text-xs text-slate-400">
              {form.description.length}/1000
            </p>
          </div>

          {/* Location */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Location *
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Example: Central Library, Block 5"
                maxLength={150}
                required
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Date */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Date of Loss / Discovery *
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                max={new Date().toLocaleDateString("en-CA")}
                required
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="mt-7">
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Item Image
              <span className="ml-2 font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <ImageUpload onImageChange={setImage} />
          </div>

          {/* Submit */}
          <div className="mt-9 border-t border-slate-100 pt-6">
            <p className="mb-5 text-xs leading-6 text-slate-400">
              Please provide accurate information. Avoid including private
              information such as passwords, personal identification numbers
              or other sensitive details in your public report.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={18} />

              {loading ? "Submitting Report..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <ProtectedRoute>
      <ReportForm />
    </ProtectedRoute>
  );
}