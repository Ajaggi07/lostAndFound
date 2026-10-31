"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import ProtectedRoute from "../../components/ProtectedRoute";
import { apiRequest } from "../../lib/api";
import { formatDate, getImageUrl } from "../../lib/utils";

import {
  LayoutDashboard,
  Package,
  FileText,
  Inbox,
  MapPin,
  CalendarDays,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("reports");

  const [reports, setReports] = useState([]);
  const [submittedClaims, setSubmittedClaims] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [reportsData, submittedData, receivedData] =
        await Promise.all([
          apiRequest("/items/my-items"),
          apiRequest("/claims/my-claims"),
          apiRequest("/claims/received"),
        ]);

      setReports(
        Array.isArray(reportsData)
          ? reportsData
          : reportsData.items || []
      );

      setSubmittedClaims(
        Array.isArray(submittedData)
          ? submittedData
          : submittedData.claims || []
      );

      setReceivedClaims(
        Array.isArray(receivedData)
          ? receivedData
          : receivedData.claims || []
      );
    } catch (err) {
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  async function handleDeleteItem(itemId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report? This action cannot be undone."
    );

    if (!confirmed) return;

    setActionLoading(itemId);
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/items/${itemId}`, {
        method: "DELETE",
      });

      setSuccess("Report deleted successfully.");
      await fetchDashboardData();
    } catch (err) {
      setError(err.message || "Unable to delete report.");
    } finally {
      setActionLoading("");
    }
  }

  async function handleItemStatus(itemId, status) {
    setActionLoading(itemId);
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/items/${itemId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setSuccess("Item status updated successfully.");
      await fetchDashboardData();
    } catch (err) {
      setError(err.message || "Unable to update item status.");
    } finally {
      setActionLoading("");
    }
  }

  async function handleClaimStatus(claimId, status) {
    setActionLoading(claimId);
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/claims/${claimId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setSuccess(
        status === "approved"
          ? "Claim approved successfully."
          : "Claim rejected successfully."
      );

      await fetchDashboardData();
    } catch (err) {
      setError(err.message || "Unable to update claim.");
    } finally {
      setActionLoading("");
    }
  }

  const tabs = [
    {
      id: "reports",
      label: "My Reports",
      icon: Package,
      count: reports.length,
    },
    {
      id: "submitted",
      label: "Submitted Claims",
      icon: FileText,
      count: submittedClaims.length,
    },
    {
      id: "received",
      label: "Received Claims",
      icon: Inbox,
      count: receivedClaims.length,
    },
  ];

  return (
    <div className="min-h-screen px-5 py-12">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600">
              <LayoutDashboard size={20} />

              <span className="text-sm font-bold uppercase tracking-widest">
                Student Dashboard
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
              My Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your reports and keep track of your claims.
            </p>
          </div>

          <Link
            href="/report"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Report New Item
          </Link>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle size={19} className="mt-0.5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="mb-9 grid gap-5 sm:grid-cols-3">
          <SummaryCard
            icon={Package}
            label="My Reports"
            count={reports.length}
          />

          <SummaryCard
            icon={FileText}
            label="Submitted Claims"
            count={submittedClaims.length}
          />

          <SummaryCard
            icon={Inbox}
            label="Received Claims"
            count={receivedClaims.length}
          />
        </div>

        {/* Tabs */}
        <div className="mb-7 flex flex-wrap gap-2 border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setError("");
                  setSuccess("");
                }}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon size={17} />
                {tab.label}

                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Refresh */}
        <div className="mb-5 flex justify-end">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          </div>
        ) : (
          <>
            {/* My Reports */}
            {activeTab === "reports" && (
              <div className="space-y-5">
                {reports.length === 0 ? (
                  <EmptyState
                    title="No reports yet"
                    description="Items you report will appear here."
                    link="/report"
                    linkText="Report an Item"
                  />
                ) : (
                  reports.map((item) => (
                    <ReportCard
                      key={item._id}
                      item={item}
                      actionLoading={actionLoading === item._id}
                      onDelete={() => handleDeleteItem(item._id)}
                      onStatusChange={(status) =>
                        handleItemStatus(item._id, status)
                      }
                    />
                  ))
                )}
              </div>
            )}

            {/* Submitted Claims */}
            {activeTab === "submitted" && (
              <div className="space-y-5">
                {submittedClaims.length === 0 ? (
                  <EmptyState
                    title="No submitted claims"
                    description="Claims you submit for found items will appear here."
                    link="/browse"
                    linkText="Browse Items"
                  />
                ) : (
                  submittedClaims.map((claim) => (
                    <ClaimCard
                      key={claim._id}
                      claim={claim}
                      mode="submitted"
                    />
                  ))
                )}
              </div>
            )}

            {/* Received Claims */}
            {activeTab === "received" && (
              <div className="space-y-5">
                {receivedClaims.length === 0 ? (
                  <EmptyState
                    title="No received claims"
                    description="Claims submitted for your found items will appear here."
                    link="/browse"
                    linkText="Browse Items"
                  />
                ) : (
                  receivedClaims.map((claim) => (
                    <ClaimCard
                      key={claim._id}
                      claim={claim}
                      mode="received"
                      actionLoading={actionLoading === claim._id}
                      onApprove={() =>
                        handleClaimStatus(claim._id, "approved")
                      }
                      onReject={() =>
                        handleClaimStatus(claim._id, "rejected")
                      }
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* Summary Card */
function SummaryCard({ icon: Icon, label, count }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            {count}
          </h2>
        </div>

        <div className="rounded-xl bg-blue-50 p-4 text-blue-600">
          <Icon size={25} />
        </div>
      </div>
    </div>
  );
}

/* Report Card */
function ReportCard({
  item,
  actionLoading,
  onDelete,
  onStatusChange,
}) {
  const imageUrl = getImageUrl(item.image);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 sm:w-36">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <Package size={40} className="text-slate-300" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                item.type === "Lost"
                  ? "bg-red-50 text-red-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {item.type}
            </span>

            <StatusBadge status={item.status} />
          </div>

          <h3 className="mt-3 text-lg font-bold text-slate-900">
            {item.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
            {item.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {item.location}
            </span>

            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              {formatDate(item.date)}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={`/item/${item._id}`}
              className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              View Details
              <ExternalLink size={14} />
            </Link>

            {item.status === "active" && (
              <select
                defaultValue=""
                disabled={actionLoading}
                onChange={(event) => {
                  if (event.target.value) {
                    onStatusChange(event.target.value);
                    event.target.value = "";
                  }
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-blue-500"
              >
                <option value="" disabled>
                  Update Status
                </option>
                <option value="claimed">Mark as Claimed</option>
                <option value="returned">Mark as Returned</option>
              </select>
            )}

            {item.status !== "returned" && (
              <button
                onClick={onDelete}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={14} />
                {actionLoading ? "Please wait..." : "Delete"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Claim Card */
function ClaimCard({
  claim,
  mode,
  actionLoading,
  onApprove,
  onReject,
}) {
  const item =
    claim.item && typeof claim.item === "object"
      ? claim.item
      : null;

  const claimant =
    claim.claimant && typeof claim.claimant === "object"
      ? claim.claimant
      : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            {mode === "received" ? "Claim received" : "Claim submitted"}
          </p>

          <h3 className="mt-2 text-lg font-bold text-slate-900">
            {item?.title || "Item details unavailable"}
          </h3>

          {item && (
            <Link
              href={`/item/${item._id}`}
              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
            >
              View Item
              <ExternalLink size={12} />
            </Link>
          )}
        </div>

        <StatusBadge status={claim.status} />
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Claim Message
        </p>

        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
          {claim.message}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-500">
        {mode === "received" && (
          <p>
            <span className="font-semibold text-slate-700">Claimant: </span>
            {claimant?.name || "Student"}
          </p>
        )}

        {mode === "submitted" && item && (
          <p>
            <span className="font-semibold text-slate-700">Item Type: </span>
            {item.type}
          </p>
        )}

        <p>
          <span className="font-semibold text-slate-700">Submitted: </span>
          {formatDate(claim.createdAt)}
        </p>
      </div>

      {mode === "received" && claim.status === "pending" && (
        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <button
            onClick={onApprove}
            disabled={actionLoading}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <CheckCircle size={16} />
            {actionLoading ? "Please wait..." : "Approve Claim"}
          </button>

          <button
            onClick={onReject}
            disabled={actionLoading}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <XCircle size={16} />
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

/* Status Badge */
function StatusBadge({ status }) {
  const styles = {
    active: "bg-blue-50 text-blue-600",
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-600",
    claimed: "bg-purple-50 text-purple-700",
    returned: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

/* Empty State */
function EmptyState({ title, description, link, linkText }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
      <Package size={48} className="mx-auto text-slate-300" />

      <h3 className="mt-5 text-xl font-bold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>

      <Link
        href={link}
        className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {linkText}
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}