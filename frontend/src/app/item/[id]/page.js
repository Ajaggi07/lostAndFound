"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Tag,
  User,
  Package,
  Send,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { apiRequest } from "../../../lib/api";
import { formatDate, getImageUrl } from "../../../lib/utils";

function ItemDetailsContent() {
  const params = useParams();
  const router = useRouter();

  const itemId = params?.id;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [claimMessage, setClaimMessage] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState("");
  const [claimError, setClaimError] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem("token")));
  }, []);

  // Fetch item details
  const fetchItem = useCallback(async () => {
    if (!itemId) return;

    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(`/items/${itemId}`);

      setItem(data.item || data);
    } catch (err) {
      setError(err.message || "Unable to load item details.");
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  // Submit a claim
  async function handleClaimSubmit(event) {
    event.preventDefault();

    setClaimError("");
    setClaimSuccess("");

    if (!loggedIn) {
      router.push("/login");
      return;
    }

    if (!claimMessage.trim()) {
      setClaimError("Please enter a message explaining your claim.");
      return;
    }

    if (claimMessage.trim().length < 10) {
      setClaimError("Please enter at least 10 characters.");
      return;
    }

    setClaimLoading(true);

    try {
      await apiRequest(`/claims/item/${itemId}`, {
        method: "POST",
        body: JSON.stringify({
          message: claimMessage.trim(),
        }),
      });

      setClaimSuccess(
        "Your claim has been submitted successfully. You can track it in your dashboard."
      );

      setClaimMessage("");
    } catch (err) {
      setClaimError(err.message || "Unable to submit your claim.");
    } finally {
      setClaimLoading(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
      </div>
    );
  }

  // Error state
  if (error || !item) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <AlertCircle size={48} className="text-red-400" />

        <h2 className="mt-5 text-2xl font-bold text-slate-900">
          Item Not Found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {error || "This item may have been removed or is unavailable."}
        </p>

        <Link
          href="/browse"
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Browse Other Items
        </Link>
      </div>
    );
  }

  const imageUrl = getImageUrl(item.image);

  const reportedBy =
    typeof item.reportedBy === "object"
      ? item.reportedBy
      : null;

  const isFoundItem = item.type === "Found";
  const isActive = item.status === "active";

  return (
    <div className="min-h-screen px-5 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Back Button */}
        <Link
          href="/browse"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Browse
        </Link>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">

          {/* Item Image */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex min-h-[350px] items-center justify-center bg-slate-100 lg:min-h-[500px]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="h-full max-h-[550px] w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-300">
                  <Package size={80} />
                  <p className="text-sm font-medium">
                    No image available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Item Information */}
          <div className="flex flex-col">

            {/* Type and Status */}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                  isFoundItem
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {item.type} Item
              </span>

              <span
                className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize ${
                  item.status === "active"
                    ? "bg-blue-50 text-blue-700"
                    : item.status === "claimed"
                    ? "bg-purple-50 text-purple-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              {item.title}
            </h1>

            {/* Description */}
            <div className="mt-7">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Description
              </h2>

              <p className="mt-3 whitespace-pre-wrap text-base leading-8 text-slate-600">
                {item.description || "No description provided."}
              </p>
            </div>

            {/* Item Details */}
            <div className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6">

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Tag size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Category
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {item.category || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {item.location || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Date
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {formatDate(item.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <User size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Reported By
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {reportedBy?.name || "CampusFind Student"}
                  </p>
                </div>
              </div>

            </div>

            {/* Claim Section */}
            {isFoundItem && isActive && (
              <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-6">

                <h2 className="text-xl font-bold text-slate-900">
                  Is this your item?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Submit a claim explaining why you believe this item
                  belongs to you. The person who reported it can review
                  your request.
                </p>

                {/* Claim Success */}
                {claimSuccess && (
                  <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    <CheckCircle size={19} className="mt-0.5 shrink-0" />
                    <p>{claimSuccess}</p>
                  </div>
                )}

                {/* Claim Error */}
                {claimError && (
                  <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle size={19} className="mt-0.5 shrink-0" />
                    <p>{claimError}</p>
                  </div>
                )}

                {!claimSuccess && (
                  <form onSubmit={handleClaimSubmit} className="mt-5">

                    <label
                      htmlFor="claimMessage"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Explain your claim
                    </label>

                    <textarea
                      id="claimMessage"
                      rows={4}
                      value={claimMessage}
                      onChange={(event) =>
                        setClaimMessage(event.target.value)
                      }
                      placeholder="Describe identifying details that can help verify your ownership..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    />

                    <button
                      type="submit"
                      disabled={claimLoading}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send size={17} />

                      {claimLoading
                        ? "Submitting Claim..."
                        : "Submit Claim"}
                    </button>

                    {!loggedIn && (
                      <p className="mt-3 text-center text-xs text-slate-500">
                        You must log in to submit a claim.
                      </p>
                    )}

                  </form>
                )}

              </div>
            )}

            {/* Inactive Item Message */}
            {item.status !== "active" && (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-100 p-5">
                <p className="text-sm font-semibold text-slate-600">
                  This item is currently marked as {item.status}.
                  New claims are not being accepted.
                </p>
              </div>
            )}

            {/* Lost Item Message */}
            {!isFoundItem && isActive && (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-sm leading-6 text-amber-800">
                  This item has been reported as lost. If you find it,
                  please use the report feature to help its owner.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// Main page with Suspense boundary
export default function ItemDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        </div>
      }
    >
      <ItemDetailsContent />
    </Suspense>
  );
}