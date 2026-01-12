import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const rawEndpoint = process.env.B2_ENDPOINT;
const region = process.env.B2_REGION || "eu-central-003";
const keyId = process.env.B2_KEY_ID;
const appKey = process.env.B2_APPLICATION_KEY;

if (!rawEndpoint || !region || !keyId || !appKey) {
  throw new Error("Missing Backblaze B2 environment variables");
}

const endpoint = rawEndpoint.startsWith("http") ? rawEndpoint : `https://${rawEndpoint}`;

const b2Client = new S3Client({
  endpoint,
  region,
  forcePathStyle: true,
  credentials: {
    accessKeyId: keyId,
    secretAccessKey: appKey,
  },
});

/**
 * Upload a file to Backblaze B2 storage
 * @param file - File buffer to upload
 * @param filename - Name for the file in storage
 * @param contentType - MIME type of the file
 * @returns URL of the uploaded file
 */
export async function uploadToB2(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const bucketName = process.env.B2_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("B2_BUCKET_NAME not configured");
  }

  console.log("B2 upload:", {
    filename,
    contentType,
    bufferLength: file.length,
    bucketName,
  });

  const timestamp = Date.now();
  const uniqueFilename = `topics/${timestamp}-${filename}`;
  const contentLength = file.byteLength;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFilename,
    Body: file,
    ContentType: contentType,
    ContentLength: contentLength,
  });

  try {
    await b2Client.send(command);
  } catch (error) {
    console.error("B2 upload error details:", {
      error,
      filename: uniqueFilename,
      bufferLength: file.length,
      contentType,
    });
    throw error;
  }

  const base = endpoint.replace(/\/$/, "");
  const publicUrl = `${base}/${bucketName}/${uniqueFilename}`;
  return publicUrl;
}

/**
 * Delete a file from Backblaze B2 storage
 * @param fileUrl - URL of the file to delete
 */
export async function deleteFromB2(fileUrl: string): Promise<void> {
  const bucketName = process.env.B2_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("B2_BUCKET_NAME not configured");
  }

  const separator = `/${bucketName}/`;
  const idx = fileUrl.indexOf(separator);
  if (idx === -1) {
    throw new Error("Invalid B2 file URL");
  }

  const fileKey = fileUrl.substring(idx + separator.length);

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  await b2Client.send(command);
}

/**
 * Validate image file type and size
 * @param file - File to validate
 * @throws Error if validation fails
 */
export function validateImageFile(file: File): void {
  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Tipo de ficheiro inválido. Apenas JPG, PNG, WebP e GIF são permitidos.");
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("Ficheiro demasiado grande. Tamanho máximo: 5MB");
  }
}
