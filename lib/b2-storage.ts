import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Validate required environment variables
const rawEndpoint = process.env.B2_ENDPOINT;
const region = process.env.B2_REGION || "eu-central-003";
const keyId = process.env.B2_KEY_ID;
const appKey = process.env.B2_APPLICATION_KEY;

if (!rawEndpoint || !keyId || !appKey) {
  throw new Error("Backblaze B2 env vars missing (B2_ENDPOINT, B2_KEY_ID, B2_APPLICATION_KEY)");
}

// Ensure endpoint has protocol
const endpoint = rawEndpoint.startsWith("http") ? rawEndpoint : `https://${rawEndpoint}`;

// Backblaze B2 client configuration
const b2Client = new S3Client({
  endpoint, // e.g., https://s3.eu-central-003.backblazeb2.com
  region,
  forcePathStyle: true, // CRITICAL for Backblaze B2 compatibility
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
  if (!endpoint) {
    throw new Error("B2_ENDPOINT not configured");
  }

  console.log("B2 upload:", {
    filename,
    contentType,
    bufferLength: file.length,
    bucketName,
  });

  // Generate a unique filename with timestamp to avoid collisions
  const timestamp = Date.now();
  const uniqueFilename = `topics/${timestamp}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFilename,
    Body: file,
    ContentType: contentType,
    ContentLength: file.length,
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

  // Return the public URL using S3-compatible format
  // Format: https://s3.eu-central-003.backblazeb2.com/bucket-name/file-key
  const publicUrl = `${endpoint}/${bucketName}/${uniqueFilename}`;
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

  // Extract the file key from the S3-compatible URL
  // Format: https://s3.../bucket-name/file-key
  const urlParts = fileUrl.split(`/${bucketName}/`);
  if (urlParts.length !== 2) {
    throw new Error("Invalid B2 file URL");
  }

  const fileKey = urlParts[1];

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  await b2Client.send(command);
}

/**
 * Validate image file type and size
 * Note: This function uses the File API and should be called on the client-side
 * or in API routes after receiving FormData
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
