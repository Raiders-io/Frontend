import api from "@/utils/lib/axios"
import type {
  ObjectIndexResponse,
  ObjectStoreResponse,
  ObjectDestroyResponse,
  ObjectDestroyManyResponse,
  QuotaResponse,
} from "@/utils/types/object"

// get '/?page&limit' 'index'
// post 'store'
// put 'updateMany'
// delete 'destroyMany'
// get '/:id' 'show'
// put '/:id' 'update'
// delete '/:id' 'destroy'
export const objectService = {
  // page and limit are optional query parameters for pagination
  index: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<ObjectIndexResponse> => {
    const { data } = await api.get<ObjectIndexResponse>(
      `/api/v1/storage/objects/?page=${page}&limit=${limit}`,
    )

    return data
  },

  store: async (formData: FormData): Promise<ObjectStoreResponse> => {
    const { data } = await api.post<ObjectStoreResponse>(
      "/api/v1/storage/objects",
      formData,
    )
    return data
  },

  download: async (fileName: string): Promise<Blob> => {
    const response = await api.get<Blob>(
      `/api/v1/storage/objects/${encodeURIComponent(fileName)}`,
      { responseType: "blob" },
    )
    return response.data
  },

  getFile: async (
    fileName: string,
  ): Promise<{ blob: Blob; mimeType: string }> => {
    const response = await api.get(
      `/api/v1/storage/objects/preview/${encodeURIComponent(fileName)}`,
      { responseType: "blob" },
    )
    const mimeType = (
      getMimeTypeFromFilename(fileName) ||
      response.headers["content-type"] ||
      "text"
    ).toString()
    return { blob: response.data, mimeType }
  },

  destroy: async (id: string): Promise<ObjectDestroyResponse> => {
    const { data } = await api.delete<ObjectDestroyResponse>(
      `/api/v1/storage/objects/${id}`,
    )
    return data
  },

  destroyMany: async (ids: string[]): Promise<ObjectDestroyManyResponse> => {
    const { data } = await api.delete<ObjectDestroyManyResponse>(
      "/api/v1/storage/objects",
      {
        data: { ids },
      },
    )
    return data
  },
  
  quotaRetrieve: async (): Promise<QuotaResponse> => {
		const { data } = await api.get<QuotaResponse>('/api/v1/storage/quota')
		return data
	}

}

function getMimeTypeFromFilename(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase()
  switch (extension) {
    case "pdf":
      return "application/pdf"
    case "md":
      return "text/markdown"
    case "txt":
      return "text/plain"
    default:
      return "application/octet-stream"
  }
}
