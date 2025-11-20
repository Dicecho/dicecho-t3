"use client";

import { useState } from "react";
import { useDicecho } from "./useDicecho";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export interface UploadOptions {
  rename?: boolean;
  onProgress?: (progress: number) => void;
}

export function useUploadOSS() {
  const { api } = useDicecho();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File, options: UploadOptions = {}) => {
    const { onProgress } = options;

    try {
      setIsUploading(true);
      setProgress(0);

      // Step 1: Get OSS credentials
      const credentials = await api.file.assume();

      const filePath = `${credentials.Path}/${file.name}`;

      // Step 2: Convert File to Uint8Array for browser compatibility
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Step 3: Configure S3 client
      const client = new S3Client({
        region: credentials.Region,
        endpoint: `https://${credentials.Endpoint}`,
        credentials: {
          accessKeyId: credentials.AccessKeyId,
          secretAccessKey: credentials.SecretAccessKey,
          sessionToken: credentials.SessionToken,
        },
      });

      // Step 4: Upload to S3
      await client.send(
        new PutObjectCommand({
          Bucket: credentials.Bucket,
          Key: filePath,
          Body: uint8Array,
          ContentType: file.type,
        })
      );

      // Construct URL
      const url = `${credentials.Secure ? "https" : "http"}://${credentials.Domain}/${filePath}`;

      setProgress(100);
      if (onProgress) onProgress(100);

      return {
        url,
        name: file.name,
      };
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return {
    upload,
    isUploading,
    progress,
  };
}
