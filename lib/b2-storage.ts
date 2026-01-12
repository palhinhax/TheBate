import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Backblaze B2 client configuration
const b2Client = new S3Client({
  endpoint: `https://${process.env.B2_ENDPOINT}`,
  region: process.env.B2_REGION || "eu-central-003",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID || "",
    secretAccessKey: process.env.B2_APPLICATION_KEY || "",
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

  // Generate a unique filename with timestamp to avoid collisions
  const timestamp = Date.now();
  const uniqueFilename = `topics/${timestamp}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFilename,
    Body: file,
    ContentType: contentType,
    ContentLength: file.length,
    // Note: B2 doesn't support ACL parameter - files are public by default if bucket is public
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

  // Return the public URL
  // Format: https://f003.backblazeb2.com/file/bucket-name/file-key
  const endpoint = process.env.B2_ENDPOINT?.replace("s3.", "f003.");
  return `https://${endpoint}/file/${bucketName}/${uniqueFilename}`;
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

  // Extract the file key from the URL
  const urlParts = fileUrl.split(`/file/${bucketName}/`);
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
