"use client";

import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

export default function ImageUpload({ onImageChange }) {
  const [preview, setPreview] = useState(null);

  function handleChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setPreview(URL.createObjectURL(file));
    onImageChange(file);
  }

  function removeImage() {
    setPreview(null);
    onImageChange(null);
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div>
      {preview ? (
        <div className="relative h-56 overflow-hidden rounded-xl border border-slate-200">
          <img
            src={preview}
            alt="Selected item preview"
            className="h-full w-full object-contain"
          />

          <button
            type="button"
            onClick={removeImage}
            className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-600 shadow"
            aria-label="Remove image"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50">
          <ImagePlus size={35} className="text-slate-400" />

          <span className="mt-3 font-semibold text-slate-700">
            Upload an item image
          </span>

          <span className="mt-1 text-xs text-slate-400">
            PNG, JPG or WebP · Maximum 5 MB
          </span>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}