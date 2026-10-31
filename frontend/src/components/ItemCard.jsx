import Link from "next/link";
import { MapPin, CalendarDays, Package } from "lucide-react";
import { formatDate, getImageUrl } from "../lib/utils";

export default function ItemCard({ item }) {
  const imageUrl = getImageUrl(item.image);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-48 items-center justify-center overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package size={55} className="text-slate-300" />
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              item.type === "Lost"
                ? "bg-red-50 text-red-600"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {item.type}
          </span>

          <span className="text-xs text-slate-400">{item.category}</span>
        </div>

        <h3 className="mt-4 truncate text-lg font-bold text-slate-900">
          {item.title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-500">
          {item.description}
        </p>

        <div className="mt-4 flex flex-col gap-2 text-sm text-slate-500">
          <p className="flex items-center gap-2">
            <MapPin size={15} />
            <span className="truncate">{item.location}</span>
          </p>

          <p className="flex items-center gap-2">
            <CalendarDays size={15} />
            {formatDate(item.date)}
          </p>
        </div>

        <Link
          href={`/item/${item._id}`}
          className="mt-5 block rounded-lg border border-blue-600 py-2.5 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}