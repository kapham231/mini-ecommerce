import axios from 'axios'
import { axiosInstance } from '~/lib/axios'
import type { ApiEnvelope } from './types'

type CreatePresignedUploadBody = {
  fileName: string
  contentType: string
}

type PresignedUploadApi = {
  uploadUrl: string
  fileUrl: string
  key: string
  expiresIn: number
}

export async function createPresignedUpload(body: CreatePresignedUploadBody): Promise<PresignedUploadApi> {
  const response = await axiosInstance.post<ApiEnvelope<PresignedUploadApi>>('/uploads/presign', body)
  return response.data.data
}

export async function uploadFileToS3(uploadUrl: string, file: File): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type
    }
  })
}
