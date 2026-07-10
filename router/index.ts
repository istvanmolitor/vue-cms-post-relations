import type { RouteRecordRaw } from 'vue-router'

const cmsRelationRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/cms-relations',
    name: 'admin-cms-relations',
    component: () => import('../views/CmsPostRelationIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms-relation-types',
    name: 'admin-cms-relation-types',
    component: () => import('../views/postRelationType/PostRelationTypeIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms-relation-types/create',
    name: 'admin-cms-relation-types-create',
    component: () => import('../views/postRelationType/PostRelationTypeCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms-relation-types/:id/edit',
    name: 'admin-cms-relation-types-edit',
    component: () => import('../views/postRelationType/PostRelationTypeEdit.vue'),
    meta: { requiresAuth: true }
  }
]

export default cmsRelationRoutes

