import { supabase } from "@/lib/supabase";
import type { PrescriptionSubmission, Product } from "@/types/product";

export async function uploadPrescription(file: File, product: Product): Promise<PrescriptionSubmission | null> {
  if (!supabase) throw new Error("Prescription uploads require Supabase to be configured.");

  const id = crypto.randomUUID();
  const storagePath = `prescriptions/${id}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const { error: uploadError } = await supabase.storage
    .from("prescriptions")
    .upload(storagePath, file, { contentType: file.type || "application/octet-stream", upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("prescriptions").getPublicUrl(storagePath);
  const submission: PrescriptionSubmission = {
    id,
    productId: product.id,
    productName: product.name,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    fileUrl: data.publicUrl,
    storagePath,
    createdAt: new Date().toISOString(),
  };

  const { error: recordError } = await supabase.from("prescription_uploads").insert({
    id: submission.id,
    product_id: submission.productId,
    product_name: submission.productName,
    file_name: submission.fileName,
    file_type: submission.fileType,
    file_size: submission.fileSize,
    file_url: submission.fileUrl,
    storage_path: submission.storagePath,
    created_at: submission.createdAt,
  });
  if (recordError) throw recordError;
  return submission;
}

export async function getPrescriptionSubmissions(): Promise<PrescriptionSubmission[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("prescription_uploads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !Array.isArray(data)) return [];
  return data.map((row) => ({
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    fileName: row.file_name,
    fileType: row.file_type,
    fileSize: row.file_size,
    fileUrl: row.file_url,
    storagePath: row.storage_path,
    createdAt: row.created_at,
  }));
}