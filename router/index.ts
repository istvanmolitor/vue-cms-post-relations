import type { RouteRecordRaw } from 'vue-router'

const cmsRelationRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/cms-relations',
    name: 'admin-cms-relations',
    component: () => import('../views/CmsPostRelationIndex.vue'),
    meta: { requiresAuth: true }
  }
]

export default cmsRelationRoutes

