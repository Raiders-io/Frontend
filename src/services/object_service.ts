import api from '@/utils/lib/axios'

// get '/?page&limit' 'index'
// post 'store'
// put 'updateMany'
// delete 'destroyMany'
// get '/:id' 'show'
// put '/:id' 'update'
// delete '/:id' 'destroy'
export const objectService = {
	// page and limit are optional query parameters for pagination
	index: async (page: number = 1, limit: number = 10): Promise<any> => {
		const { data } = await api.get<any>(`/api/v1/storage/objects/?page=${page}&limit=${limit}`)
		return data
	},

	store: async (formData: FormData): Promise<any> => {
		const { data } = await api.post<any>('/api/v1/storage/objects', formData)
		return data
	}
}
