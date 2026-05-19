import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface PostOption {
  id: number
  title: string
}

export interface CmsPostRelation {
  id?: number
  post_id: number
  post_title?: string
  related_post_id: number
  related_post_title?: string
  sort: number
  created_at?: string
  updated_at?: string
}

export interface CmsPostRelationFormData {
  post_id: number | null
  related_post_id: number | null
  sort: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  filters?: {
    search?: string
    sort?: string
    direction?: string
  }
}

export interface SingleResponse<T> {
  data: T
}

export interface CmsPostRelationOptionsResponse {
  posts: PostOption[]
}

export const cmsPostRelationService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<CmsPostRelation>>('/api/admin/cms-post-relations', { params })
  },
  getOptions() {
    return api.get<CmsPostRelationOptionsResponse>('/api/admin/cms-post-relations/options')
  },
  create(payload: CmsPostRelationFormData) {
    return api.post<SingleResponse<CmsPostRelation>>('/api/admin/cms-post-relations', payload)
  },
  update(id: number, payload: CmsPostRelationFormData) {
    return api.put<SingleResponse<CmsPostRelation>>(`/api/admin/cms-post-relations/${id}`, payload)
  },
  delete(id: number) {
    return api.delete(`/api/admin/cms-post-relations/${id}`)
  },
}


