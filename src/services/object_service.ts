import api from '@/utils/lib/axios'
import type { ObjectIndexResponse, ObjectStoreResponse } from '@/utils/types/object'

// get '/?page&limit' 'index'
// post 'store'
// put 'updateMany'
// delete 'destroyMany'
// get '/:id' 'show'
// put '/:id' 'update'
// delete '/:id' 'destroy'
export const objectService = {
	// page and limit are optional query parameters for pagination
	index: async (page: number = 1, limit: number = 10): Promise<ObjectIndexResponse> => {
		const { data } = await api.get<ObjectIndexResponse>(`/api/v1/storage/objects/?page=${page}&limit=${limit}`)
	
		return data
	},

	store: async (formData: FormData): Promise<ObjectStoreResponse> => {
		const { data } = await api.post<ObjectStoreResponse>('/api/v1/storage/objects', formData)
		return data
	},

	show: async (id: string): Promise<any> => {
		const { data } = await api.get<any>(`/api/v1/storage/objects/${id}`)
		return data
	},

	download: async (fileName: string): Promise<Blob> => {
		const response = await api.get<Blob>(
			`/api/v1/storage/objects/${encodeURIComponent(fileName)}`,
			{ responseType: 'blob' },
		)
		return response.data
	},

	destroy: async (id: string): Promise<any> => {
		const { data } = await api.delete<any>(`/api/v1/storage/objects/${id}`)
		return data
	},

	destroyMany: async (ids: string[]): Promise<any> => {
		const { data } = await api.delete<any>('/api/v1/storage/objects', {
			data: { ids },
		})
		return data
	}
}
