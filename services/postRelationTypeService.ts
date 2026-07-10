import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface PostRelationType {
  id: number
  name: string
  slug: string
  description: string | null
  created_at?: string
  updated_at?: string
}

export interface PostRelationTypeFormData {
  name: string
  slug: string
  description: string
}

export interface SingleResponse<T> {
  data: T
}

export const postRelationTypeService = {
  getById(id: number | string) {
    return api.get<SingleResponse<PostRelationType>>(`/api/admin/post-relation-types/${id}`)
  },
  create(payload: PostRelationTypeFormData) {
    return api.post<SingleResponse<PostRelationType>>('/api/admin/post-relation-types', payload)
  },
  update(id: number | string, payload: PostRelationTypeFormData) {
    return api.put<SingleResponse<PostRelationType>>(`/api/admin/post-relation-types/${id}`, payload)
  },
  delete(id: number | string) {
    return api.delete(`/api/admin/post-relation-types/${id}`)
  },
}
