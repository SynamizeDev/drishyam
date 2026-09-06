"use client";

import { Plus, Trash2 } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import type {
  CorridorOption,
  LensOption,
  ProductLensConfiguration,
  VisionTypeOption,
} from "@/types/product";

interface LensConfigurationEditorProps {
  value: ProductLensConfiguration;
  onChange: (value: ProductLensConfiguration) => void;
  fieldClass: string;
}

const emptyLens = (): LensOption => ({ id: `lens-${Date.now()}`, name: "", price: 0 });
const emptyCorridor = (): CorridorOption => ({ id: `corridor-${Date.now()}`, name: "", price: 0 });
const emptyVision = (): VisionTypeOption => ({
  id: `vision-${Date.now()}`,
  name: "",
  image: "",
  lensOptions: [emptyLens()],
});

function updateAt<T>(items: T[], index: number, value: T) {
  return items.map((item, itemIndex) => itemIndex === index ? value : item);
}

export default function LensConfigurationEditor({ value, onChange, fieldClass }: LensConfigurationEditorProps) {
  const updateVision = (index: number, patch: Partial<VisionTypeOption>) => {
    onChange({ ...value, visionTypes: updateAt(value.visionTypes, index, { ...value.visionTypes[index], ...patch }) });
  };

  const updateLens = (visionIndex: number, lensIndex: number, patch: Partial<LensOption>) => {
    const vision = value.visionTypes[visionIndex];
    updateVision(visionIndex, { lensOptions: updateAt(vision.lensOptions, lensIndex, { ...vision.lensOptions[lensIndex], ...patch }) });
  };

  const updateCorridor = (visionIndex: number, corridorIndex: number, patch: Partial<CorridorOption>) => {
    const vision = value.visionTypes[visionIndex];
    const corridor = vision.corridors?.[corridorIndex] ?? emptyCorridor();
    updateVision(visionIndex, { corridors: updateAt(vision.corridors ?? [], corridorIndex, { ...corridor, ...patch }) });
  };

  return (
    <div className="space-y-5 rounded-2xl border border-[#eadcc6] bg-[#fffaf5] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#111111]">Lens configuration</p>
          <p className="mt-1 text-xs text-[#111111]/50">Build the options customers see on this product page.</p>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-xs font-semibold text-[#111111]">
          <input type="checkbox" checked={value.enabled} onChange={(event) => onChange({ ...value, enabled: event.target.checked })} className="h-4 w-4 accent-orange-500" />
          Enabled
        </label>
      </div>

      <div className="space-y-4">
        {value.visionTypes.map((vision, visionIndex) => (
          <div key={vision.id || visionIndex} className="rounded-2xl border border-[#eadcc6] bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a55d00]">Vision type {visionIndex + 1}</p>
              <button type="button" onClick={() => onChange({ ...value, visionTypes: value.visionTypes.filter((_, index) => index !== visionIndex) })} className="inline-flex items-center gap-1 text-xs font-semibold text-red-600" aria-label="Delete vision type"><Trash2 className="h-3.5 w-3.5" />Remove</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#111111]/55">Name</span><input value={vision.name} onChange={(event) => updateVision(visionIndex, { name: event.target.value, id: event.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") })} placeholder="e.g. Progressive" className={fieldClass} /></label>
              <div className="sm:col-span-2">
                <ImageUploader
                  label="Vision type image"
                  value={vision.image}
                  onChange={(image) => updateVision(visionIndex, { image })}
                  aspectRatio="video"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between"><p className="text-xs font-semibold text-[#111111]">Lens options</p><button type="button" onClick={() => updateVision(visionIndex, { lensOptions: [...vision.lensOptions, emptyLens()] })} className="inline-flex items-center gap-1 text-xs font-semibold text-[#a55d00]"><Plus className="h-3.5 w-3.5" />Add lens</button></div>
              {vision.lensOptions.map((lens, lensIndex) => (
                <div key={lens.id || lensIndex} className="grid gap-2 rounded-xl border border-[#f1e8db] bg-[#fffaf5] p-3 sm:grid-cols-[1fr_120px_auto]">
                  <input value={lens.name} onChange={(event) => updateLens(visionIndex, lensIndex, { name: event.target.value, id: event.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") })} placeholder="Lens name" className={fieldClass} />
                  <input type="number" min="0" value={lens.price} onChange={(event) => updateLens(visionIndex, lensIndex, { price: Number(event.target.value) || 0 })} placeholder="Price" className={fieldClass} />
                  <button type="button" onClick={() => updateVision(visionIndex, { lensOptions: vision.lensOptions.filter((_, index) => index !== lensIndex) })} className="flex h-10 items-center justify-center text-red-600" aria-label="Delete lens"><Trash2 className="h-4 w-4" /></button>
                  <input value={lens.description ?? ""} onChange={(event) => updateLens(visionIndex, lensIndex, { description: event.target.value })} placeholder="Description (optional)" className={`${fieldClass} sm:col-span-3`} />
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between"><p className="text-xs font-semibold text-[#111111]">Progressive corridors</p><button type="button" onClick={() => updateVision(visionIndex, { corridors: [...(vision.corridors ?? []), emptyCorridor()] })} className="inline-flex items-center gap-1 text-xs font-semibold text-[#a55d00]"><Plus className="h-3.5 w-3.5" />Add corridor</button></div>
              {(vision.corridors ?? []).map((corridor, corridorIndex) => (
                <div key={corridor.id || corridorIndex} className="grid gap-2 rounded-xl border border-[#f1e8db] bg-[#fffaf5] p-3 sm:grid-cols-[1fr_120px_auto]">
                  <input value={corridor.name} onChange={(event) => updateCorridor(visionIndex, corridorIndex, { name: event.target.value, id: event.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") })} placeholder="Corridor name" className={fieldClass} />
                  <input type="number" min="0" value={corridor.price} onChange={(event) => updateCorridor(visionIndex, corridorIndex, { price: Number(event.target.value) || 0 })} placeholder="Price" className={fieldClass} />
                  <button type="button" onClick={() => updateVision(visionIndex, { corridors: vision.corridors?.filter((_, index) => index !== corridorIndex) })} className="flex h-10 items-center justify-center text-red-600" aria-label="Delete corridor"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => onChange({ ...value, visionTypes: [...value.visionTypes, emptyVision()] })} className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white"><Plus className="h-4 w-4" />Add vision type</button>

      <div className="rounded-2xl border border-[#eadcc6] bg-white p-4">
        <p className="text-xs font-semibold text-[#111111]">Additional paid options</p>
        <div className="mt-3 space-y-2">
          {(value.additionalOptions ?? []).map((option, index) => (
            <div key={option.id || index} className="grid gap-2 sm:grid-cols-[1fr_120px_auto]">
              <input value={option.name} onChange={(event) => onChange({ ...value, additionalOptions: updateAt(value.additionalOptions ?? [], index, { ...option, id: event.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"), name: event.target.value }) })} placeholder="Option name" className={fieldClass} />
              <input type="number" min="0" value={option.price} onChange={(event) => onChange({ ...value, additionalOptions: updateAt(value.additionalOptions ?? [], index, { ...option, price: Number(event.target.value) || 0 }) })} placeholder="Price" className={fieldClass} />
              <button type="button" onClick={() => onChange({ ...value, additionalOptions: (value.additionalOptions ?? []).filter((_, itemIndex) => itemIndex !== index) })} className="flex h-10 items-center justify-center text-red-600" aria-label="Delete option"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => onChange({ ...value, additionalOptions: [...(value.additionalOptions ?? []), emptyLens()] })} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#a55d00]"><Plus className="h-3.5 w-3.5" />Add paid option</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={value.prescription?.enabled ?? false} onChange={(event) => onChange({ ...value, prescription: { ...(value.prescription ?? {}), enabled: event.target.checked } })} className="h-4 w-4 accent-orange-500" />Allow prescription upload</label>
        <label className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={value.prescription?.required ?? false} onChange={(event) => onChange({ ...value, prescription: { ...(value.prescription ?? { enabled: true }), required: event.target.checked } })} className="h-4 w-4 accent-orange-500" />Require prescription</label>
        <label className="block"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#111111]/55">Accepted files</span><input value={value.prescription?.accept ?? ".pdf,image/*"} onChange={(event) => onChange({ ...value, prescription: { ...(value.prescription ?? { enabled: true }), accept: event.target.value } })} className={fieldClass} /></label>
        <label className="block"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#111111]/55">Max file size (MB)</span><input type="number" min="1" value={value.prescription?.maxSizeMb ?? 10} onChange={(event) => onChange({ ...value, prescription: { ...(value.prescription ?? { enabled: true }), maxSizeMb: Number(event.target.value) || 1 } })} className={fieldClass} /></label>
      </div>
    </div>
  );
}
