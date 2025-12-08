"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDicecho } from "./useDicecho";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { OSSCredentials } from "@/utils/api";
import { waitUntil } from "@/utils/promise";

export interface UploadOptions {
  rename?: boolean;
  onProgress?: (progress: number) => void;
}

const useAssumeRole = () => {
  const { api, initialized } = useDicecho();
  return useQuery({
    queryKey: ['assumeRole'],
    queryFn: async () => {
      await waitUntil(() => initialized, 1000);
      return api.file.assume();
    },
  });
}

// 核心上传逻辑: 只做一件事 - 上传文件
async function uploadToS3(
  file: File,
  credentials: OSSCredentials,
  onProgress?: (progress: number) => void
) {
  const filePath = `${credentials.Path}/${file.name}`;
  
  // 转换为 Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // 配置 S3 client
  const client = new S3Client({
    region: credentials.Region,
    endpoint: `https://${credentials.Endpoint}`,
    credentials: {
      accessKeyId: credentials.AccessKeyId,
      secretAccessKey: credentials.SecretAccessKey,
      sessionToken: credentials.SessionToken,
    },
  });
  
  // 上传
  await client.send(
    new PutObjectCommand({
      Bucket: credentials.Bucket,
      Key: filePath,
      Body: uint8Array,
      ContentType: file.type,
    })
  );
  
  if (onProgress) onProgress(100);
  
  // 返回 URL
  const url = `${credentials.Secure ? "https" : "http"}://${credentials.Domain}/${filePath}`;
  return { url, name: file.name };
}

// 对外暴露的 Hook: 保持原有接口不变并增加 error
export function useUploadOSS() {
  const [progress, setProgress] = useState(0);
  const { data: credentials } = useAssumeRole();
  // 上传 mutation
  const mutation = useMutation({
    mutationFn: async ({ 
      file, 
      options 
    }: { 
      file: File; 
      options: UploadOptions 
    }) => {
      if (!credentials) {
        throw new Error('Failed to get credentials');
      }
      
      setProgress(0);
      
      const result = await uploadToS3(
        file, 
        credentials,
        (p) => {
          setProgress(p);
          options.onProgress?.(p);
        }
      );
      
      setProgress(100);
      return result;
    },
    onSettled: () => {
      // 上传完成或失败后重置进度
      setProgress(0);
    },
  });
  
  // 保持原有 API 接口
  const upload = async (file: File, options: UploadOptions = {}) => {
    return mutation.mutateAsync({ file, options });
  };
  
  return {
    upload,
    isUploading: mutation.isPending,
    progress,
    error: mutation.error,
  };
}
