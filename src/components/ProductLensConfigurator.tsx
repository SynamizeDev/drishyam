"use client";

import { useState } from "react";
import Image from "next/image";
import { CircleHelp, FileText, Trash2, Upload } from "lucide-react";
import type {
  LensOption,
  Product,
  ProductConfigurationSelection,
  VisionTypeOption,
} from "@/types/product";
import { uploadPrescription } from "@/lib/prescription-uploads";

interface Pricing {
  basePrice: number;
  optionsAmount: number;
  finalPrice: number;
}

interface ProductLensConfiguratorProps {
  product: Product;
  onChange: (selection: ProductConfigurationSelection, pricing: Pricing, valid: boolean) => void;
}

const frameOnlySelection: ProductConfigurationSelection = { purchaseType: "frame-only" };

function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ProductLensConfigurator({ product, onChange }: ProductLensConfiguratorProps) {
  const configuration = product.lensConfiguration;
  const [selection, setSelection] = useState<ProductConfigurationSelection>(frameOnlySelection);
  const [fileError, setFileError] = useState("");
  const [isUploadingPrescription, setIsUploadingPrescription] = useState(false);

  if (!configuration?.enabled || configuration.visionTypes.length === 0) return null;

  const vision = configuration.visionTypes.find((item) => item.id === selection.visionType);
  const lens = vision?.lensOptions.find((item) => item.id === selection.lensType);
  const corridor = vision?.corridors?.find((item) => item.id === selection.corridor);
  const additionalOptions = configuration.additionalOptions ?? [];
  const optionsAmount = (lens?.price ?? 0) + (corridor?.price ?? 0) + additionalOptions
    .filter((item) => selection.additionalOptions?.includes(item.id))
    .reduce((total, item) => total + item.price, 0);
  const prescription = configuration.prescription;
  const prescriptionMissing = Boolean(
    selection.purchaseType === "with-lenses" &&
    prescription?.enabled &&
    prescription.required &&
    !selection.prescription
  );
  const valid = selection.purchaseType === "frame-only" || Boolean(
    selection.visionType &&
    selection.lensType &&
    (!vision?.corridors?.length || selection.corridor) &&
    !prescriptionMissing
  );

  const update = (next: ProductConfigurationSelection) => {
    const nextVision = configuration.visionTypes.find((item) => item.id === next.visionType);
    const nextLens = nextVision?.lensOptions.find((item) => item.id === next.lensType);
    const nextCorridor = nextVision?.corridors?.find((item) => item.id === next.corridor);
    const nextOptionsAmount = (nextLens?.price ?? 0) + (nextCorridor?.price ?? 0) + additionalOptions
      .filter((item) => next.additionalOptions?.includes(item.id))
      .reduce((total, item) => total + item.price, 0);
    const nextValid = next.purchaseType === "frame-only" || Boolean(
      next.visionType &&
      next.lensType &&
      (!nextVision?.corridors?.length || next.corridor) &&
      !(prescription?.enabled && prescription.required && !next.prescription)
    );
    setSelection(next);
    onChange(next, {
      basePrice: product.price,
      optionsAmount: nextOptionsAmount,
      finalPrice: product.price + nextOptionsAmount,
    }, nextValid);
  };

  const chooseVision = (nextVision: VisionTypeOption) => {
    update({
      purchaseType: "with-lenses",
      visionType: nextVision.id,
      lensType: undefined,
      corridor: undefined,
      additionalOptions: selection.additionalOptions,
      prescription: selection.prescription,
    });
  };

  const chooseFile = async (file: File | undefined) => {
    if (!file || !prescription) return;
    const maxBytes = (prescription.maxSizeMb ?? 10) * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileError(`Please choose a file smaller than ${prescription.maxSizeMb ?? 10} MB.`);
      return;
    }
    setFileError("");
    setIsUploadingPrescription(true);
    try {
      const submission = await uploadPrescription(file, product);
      update({
        ...selection,
        purchaseType: "with-lenses",
        prescription: {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          url: submission?.fileUrl,
          storagePath: submission?.storagePath,
        },
      });
    } catch (error) {
      setFileError(error instanceof Error ? error.message : "Prescription upload failed.");
    } finally {
      setIsUploadingPrescription(false);
    }
  };

  const renderOption = (option: LensOption, selected: boolean, onSelect: () => void) => (
    <button
      key={option.id}
      type="button"
      onClick={onSelect}
      className={`flex min-h-20 items-start gap-3 rounded-2xl border p-4 text-left transition ${selected ? "border-saffron bg-orange-50/60 ring-2 ring-saffron/15" : "border-beige-100 bg-white hover:border-saffron/50"}`}
    >
      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${selected ? "border-saffron" : "border-charcoal/30"}`}>
        {selected && <span className="h-2 w-2 rounded-full bg-saffron" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2 text-sm font-semibold text-charcoal">
          <span>{option.name}</span>
          <span className="shrink-0">+{formatPrice(option.price)}</span>
        </span>
        {option.description && <span className="mt-1 block text-xs leading-5 text-charcoal/55">{option.description}</span>}
        {option.info && <span className="mt-1 flex items-center gap-1 text-[11px] text-saffron"><CircleHelp className="h-3 w-3" />{option.info}</span>}
      </span>
    </button>
  );

  return (
    <section className="space-y-5 border-t border-beige-100 pt-6" aria-labelledby="options-more-heading">
      <div>
        <p id="options-more-heading" className="text-[11px] font-bold uppercase tracking-[0.2em] text-saffron">Options &amp; More</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            { id: "frame-only" as const, name: "Frame Only", description: "Just the frame, ready to style your way." },
            { id: "with-lenses" as const, name: "Buy With Lenses", description: "Add prescription-ready lenses to your frame." },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => update(item.id === "frame-only" ? frameOnlySelection : { ...selection, purchaseType: "with-lenses" })}
              className={`rounded-2xl border p-4 text-left transition ${selection.purchaseType === item.id ? "border-saffron bg-orange-50/60 ring-2 ring-saffron/15" : "border-beige-100 bg-white hover:border-saffron/50"}`}
            >
              <span className="flex items-center gap-3">
                <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${selection.purchaseType === item.id ? "border-saffron" : "border-charcoal/30"}`}>
                  {selection.purchaseType === item.id && <span className="h-2 w-2 rounded-full bg-saffron" />}
                </span>
                <span className="font-semibold text-charcoal">{item.name}</span>
              </span>
              <span className="mt-2 block pl-7 text-xs leading-5 text-charcoal/55">{item.description}</span>
            </button>
          ))}
        </div>
      </div>

      {selection.purchaseType === "with-lenses" && (
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-charcoal">Select Your Vision Type</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {configuration.visionTypes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseVision(item)}
                  className={`overflow-hidden rounded-2xl border text-left transition ${selection.visionType === item.id ? "border-saffron ring-2 ring-saffron/15" : "border-beige-100 hover:border-saffron/50"}`}
                >
                  <div className="relative aspect-[4/3] bg-beige-50">
                    <Image src={item.image} alt="" fill unoptimized className="object-cover" sizes="(max-width: 640px) 45vw, 220px" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-charcoal">{item.name}</p>
                    {item.description && <p className="mt-1 text-xs leading-5 text-charcoal/55">{item.description}</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {vision && (
            <div>
              <h3 className="text-sm font-semibold text-charcoal">Select Lenses Type</h3>
              <div className="mt-3 grid gap-3">{vision.lensOptions.map((item) => renderOption(item, selection.lensType === item.id, () => update({ ...selection, purchaseType: "with-lenses", lensType: item.id })))}</div>
            </div>
          )}

          {vision?.corridors && vision.corridors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-charcoal">Select Progressive Vision Corridor</h3>
              <div className="mt-3 grid gap-3">{vision.corridors.map((item) => renderOption(item, selection.corridor === item.id, () => update({ ...selection, corridor: item.id })))}</div>
            </div>
          )}

          {additionalOptions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-charcoal">Additional Options</h3>
              <div className="mt-3 grid gap-3">{additionalOptions.map((item) => {
                const checked = selection.additionalOptions?.includes(item.id) ?? false;
                return <label key={item.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-beige-100 bg-white p-4 text-sm"><span className="flex items-center gap-3"><input type="checkbox" checked={checked} onChange={() => update({ ...selection, additionalOptions: checked ? (selection.additionalOptions ?? []).filter((id) => id !== item.id) : [...(selection.additionalOptions ?? []), item.id] })} className="h-4 w-4 accent-orange-500" />{item.name}</span><span className="shrink-0 font-semibold">+{formatPrice(item.price)}</span></label>;
              })}</div>
            </div>
          )}

          {prescription?.enabled && (
            <div className="rounded-2xl border border-beige-100 bg-[#fffdfb] p-4">
              <h3 className="text-sm font-semibold text-charcoal">Submit Your Prescription Here Or Add Into Account After Checkout</h3>
              <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-beige-200 bg-white px-4 py-4 text-sm font-semibold text-charcoal transition hover:border-saffron">
                <Upload className="h-4 w-4 text-saffron" />
                {isUploadingPrescription ? "Uploading prescription..." : selection.prescription ? "Replace prescription file" : "Choose prescription file"}
                <input type="file" accept={prescription.accept || ".pdf,image/*"} disabled={isUploadingPrescription} onChange={(event) => void chooseFile(event.target.files?.[0])} className="sr-only" />
              </label>
              {selection.prescription && <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-xs"><span className="flex min-w-0 items-center gap-2 truncate"><FileText className="h-4 w-4 shrink-0 text-saffron" />{selection.prescription.name}</span><button type="button" onClick={() => update({ ...selection, prescription: undefined })} className="shrink-0 text-red-500" aria-label="Remove prescription"><Trash2 className="h-4 w-4" /></button></div>}
              {fileError && <p className="mt-2 text-xs text-red-600">{fileError}</p>}
              {prescription.required && !selection.prescription && <p className="mt-2 text-xs text-red-600">A prescription file is required for this product.</p>}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-beige-100 bg-beige-50/60 p-4 text-sm">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal/45">Options amount</p><p className="mt-1 font-semibold text-charcoal">{formatPrice(selection.purchaseType === "frame-only" ? 0 : optionsAmount)}</p></div>
        <div className="text-right"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal/45">Final total</p><p className="mt-1 text-lg font-semibold text-charcoal">{formatPrice(selection.purchaseType === "frame-only" ? product.price : product.price + optionsAmount)}</p></div>
      </div>
      {!valid && selection.purchaseType === "with-lenses" && <p className="text-xs font-medium text-red-600">Select a vision type, lens, and any required corridor or prescription before adding this product.</p>}
    </section>
  );
}
