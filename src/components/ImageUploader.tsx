"use client";

import React, { useRef, useState } from "react";
import { Link as LinkIcon, CheckCircle, Plus, Trash2, Upload } from "lucide-react";
import { compressImageFile } from "@/lib/image-compressor";
import { supabase } from "@/lib/supabase";

export interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  aspectRatio?: "video" | "square" | "portrait" | "banner";
  className?: string;
  multiple?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Image",
  placeholder = "https://images.unsplash.com/... or paste a second direct URL separated by a comma",
  aspectRatio = "video",
  className = "",
  multiple = false,
}: ImageUploaderProps) {
  const [urlText, setUrlText] = useState(() => (value && !value.startsWith("data:") ? value : ""));
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass = {
    video: "aspect-[16/9]",
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    banner: "aspect-[21/9]",
  }[aspectRatio];

  const isLikelyHttpUrl = (input: string) => /^https?:\/\//i.test(input.trim());
  const imageValues = (rawValue: string) => rawValue.split(",").map((item) => item.trim()).filter(Boolean);
  const imageFields = (rawValue: string) => rawValue ? rawValue.split(",").map((item) => item.trim()) : [""];
  const uploadPlaceholder = multiple
    ? "Paste image URLs separated by commas"
    : placeholder;

  const handleUrlValue = (rawValue: string) => {
    const nextValue = rawValue.trim();
    setUrlText(nextValue);
    setError(null);

    if (!nextValue) {
      onChange("");
      return;
    }

    if (nextValue.startsWith("data:")) {
      onChange(nextValue);
      return;
    }

    if (!multiple && !isLikelyHttpUrl(nextValue)) {
      setError("Please enter a valid image URL starting with http:// or https://");
    }

    if (multiple && imageValues(nextValue).some((image) => !isLikelyHttpUrl(image))) {
      setError("Please enter valid image URLs separated by commas.");
    }

    onChange(nextValue);
  };

  const updateImageUrl = (index: number, nextImage: string) => {
    const nextImages = imageFields(urlText);
    nextImages[index] = nextImage.trim();
    const nextValue = nextImages.join(",");
    setUrlText(nextValue);
    setError(null);
    onChange(nextValue);
  };

  const addImageUrlField = () => {
    const nextValue = [...imageFields(urlText), ""].join(",");
    setUrlText(nextValue);
    onChange(nextValue);
  };

  const removeImageUrl = (index: number) => {
    const nextImages = imageFields(urlText).filter((_, imageIndex) => imageIndex !== index);
    const nextValue = nextImages.join(",");
    setUrlText(nextValue);
    onChange(nextValue);
  };

  const handleFileUpload = async (files: File[]) => {
    setError(null);
    if (!supabase) {
      setError("Supabase is not configured. Add the public environment variables before uploading.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const compressedImage = await compressImageFile(file);
        const response = await fetch(compressedImage);
        const imageBlob = await response.blob();
        const filePath = `admin/${crypto.randomUUID()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("site-images")
          .upload(filePath, imageBlob, { contentType: "image/jpeg", upsert: false });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("site-images").getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }
      const nextValue = multiple
        ? [...imageValues(value), ...uploadedUrls].join(",")
        : uploadedUrls[0];
      setUrlText(nextValue);
      onChange(nextValue);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header & Tabs */}
      <div className="flex items-center justify-between">
        {label && (
          <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">
            {label}
          </span>
        )}
        <div className="flex rounded-lg border border-blue-300 bg-blue-50/80 p-0.5 text-[10px] font-bold uppercase">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-blue-700 px-3 py-1.5 flex items-center gap-1 font-semibold disabled:opacity-50"
          >
            <Upload className="h-3 w-3" />
            {isUploading ? "Uploading..." : multiple ? "Upload images" : "Upload image"}
          </button>
          <div className="text-blue-700 px-3 py-1.5 flex items-center gap-1 font-semibold border-l border-blue-200">
            <LinkIcon className="h-3 w-3" />
            <span>URL</span>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) void handleFileUpload(files);
          event.target.value = "";
        }}
      />

      {/* URL Input - Persistent for Deployment */}
      <div className="space-y-2">
        {multiple ? (
          <>
            {imageFields(urlText).map((image, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={image}
                  onChange={(event) => updateImageUrl(index, event.target.value)}
                  placeholder={`Image URL ${index + 1}`}
                  className="w-full rounded-xl border border-[#eadcc6] bg-[#fffdf9] px-3.5 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20"
                />
                <button type="button" onClick={() => removeImageUrl(index)} disabled={imageFields(urlText).length <= 1 && !image} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-600 disabled:cursor-not-allowed disabled:opacity-30" aria-label={`Remove image URL ${index + 1}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={addImageUrlField} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a55d00]"><Plus className="h-3.5 w-3.5" />Add image URL</button>
          </>
        ) : (
          <input
            type="text"
            value={urlText}
            onChange={(e) => handleUrlValue(e.target.value)}
            onBlur={() => {
              const trimmed = urlText.trim();
              setUrlText(trimmed);
              if (trimmed && !trimmed.startsWith("data:") && !isLikelyHttpUrl(trimmed)) setError("Please enter a valid image URL starting with http:// or https://");
              onChange(trimmed);
            }}
            placeholder={uploadPlaceholder}
            className="w-full rounded-xl border border-[#eadcc6] bg-[#fffdf9] px-3.5 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20"
          />
        )}
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      {/* Storage note */}
      {!value && (
        <div className="rounded-lg border border-blue-200 bg-blue-50/80 p-3.5 text-[10px] text-blue-900">
          <p className="font-semibold">Images added here remain available after deployment.</p>
          <p className="mt-1">You can also paste a public image URL below.</p>
        </div>
      )}

      {/* Preview Card */}
      {value && (
        <div className="relative overflow-hidden rounded-2xl border border-[#eadcc6] bg-[#111111]/5 p-1.5">
          <div className={multiple ? "grid grid-cols-2 gap-2" : ""}>
            {imageValues(value).map((image, index) => (
              <div key={`${image}-${index}`} className={`relative ${aspectClass} w-full overflow-hidden rounded-xl bg-slate-900/10`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                  onLoad={() => setError(null)}
                  onError={() => setError("Preview is blocked or the image URL is invalid. Check the entered URL.")}
                />
              </div>
            ))}
          </div>

          <div className="mt-1.5 flex items-center justify-between px-1.5 py-0.5 text-[10px]">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
              <CheckCircle className="h-3 w-3" />
              {`Image URL Saved (Will persist after deployment)`}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange("")}
                className="font-bold text-red-600 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
