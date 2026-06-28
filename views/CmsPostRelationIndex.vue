<script setup lang="ts">
import { AdminLayout, EditButton, DeleteButton, toastService, InputError } from '@admin'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Label from '@admin/components/ui/Label.vue'
import Input from '@admin/components/ui/Input.vue'
import SaveButton from '@admin/components/ui/button/SaveButton.vue'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { PostSelector } from '@cms'
import { reactive, ref } from 'vue'
import {
  cmsPostRelationService,
  type CmsPostRelation,
  type CmsPostRelationFormData,
} from '../services/cmsPostRelationService'

const table = ref()
const isSaving = ref(false)
const editingRelationId = ref<number | null>(null)
const errors = ref<Record<string, string[]>>({})

const form = reactive<CmsPostRelationFormData>({
  post_id: null,
  related_post_id: null,
  sort: 0,
})

const resetForm = (preservePostId = false) => {
  if (!preservePostId) {
    form.post_id = null
  }

  form.related_post_id = null
  form.sort = 0
  editingRelationId.value = null
  errors.value = {}
}

const submit = async () => {
  if (form.post_id === null || form.related_post_id === null) {
    toastService.error('Valassz ket posztot.')
    return
  }

  try {
    isSaving.value = true
    errors.value = {}

    if (editingRelationId.value === null) {
      await cmsPostRelationService.create(form)
      toastService.success('Kapcsolat letrehozva.')
    } else {
      await cmsPostRelationService.update(editingRelationId.value, form)
      toastService.success('Kapcsolat frissitve.')
    }

    table.value?.refresh()
    resetForm(true)
  } catch (error: any) {
    console.error('Hiba mentes kozben:', error)

    if (error.response?.status === 422) {
      errors.value = error.response.data.errors ?? {}
      toastService.error('Ellenorizd az adatokat.')
      return
    }

    toastService.error('A mentes sikertelen.')
  } finally {
    isSaving.value = false
  }
}

const startEdit = (relation: CmsPostRelation) => {
  editingRelationId.value = relation.id ?? null
  form.post_id = relation.post_id
  form.related_post_id = relation.related_post_id
  form.sort = relation.sort
}

const removeRelation = async (relation: CmsPostRelation) => {
  if (!relation.id) {
    return
  }

  try {
    await cmsPostRelationService.delete(relation.id)
    toastService.success('Kapcsolat torolve.')
    table.value?.refresh()

    if (editingRelationId.value === relation.id) {
      resetForm(true)
    }
  } catch (error) {
    console.error('Hiba torles kozben:', error)
    toastService.error('A torles sikertelen.')
  }
}
</script>

<template>
  <AdminLayout pageTitle="CMS poszt-poszt kapcsolatok">
    <Card class="mb-4">
      <CardHeader>
        <CardTitle>{{ editingRelationId ? 'Kapcsolat szerkesztese' : 'Uj kapcsolat' }}</CardTitle>
      </CardHeader>
      <CardContent class="grid gap-4 md:grid-cols-4">
        <div class="space-y-2 md:col-span-2">
          <Label for="post_id">Alap poszt</Label>
          <PostSelector
            id="post_id"
            v-model="form.post_id"
            placeholder="Válassz posztot..."
          />
          <InputError :message="errors.post_id" />
        </div>

        <div class="space-y-2 md:col-span-2">
          <Label for="related_post_id">Kapcsolt poszt</Label>
          <PostSelector
            id="related_post_id"
            v-model="form.related_post_id"
            placeholder="Válassz kapcsolt posztot..."
          />
          <InputError :message="errors.related_post_id" />
        </div>

        <div class="space-y-2 md:col-span-1">
          <Label for="sort">Sorrend</Label>
          <Input id="sort" v-model.number="form.sort" type="number" min="0" />
          <InputError :message="errors.sort" />
        </div>

        <div class="flex items-end gap-2 md:col-span-3">
          <SaveButton :is-saving="isSaving" @click="submit">
            {{ editingRelationId ? 'Frissites' : 'Hozzarendeles' }}
          </SaveButton>
          <button
            type="button"
            class="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm"
            @click="resetForm"
          >
            Megse
          </button>
        </div>
      </CardContent>
    </Card>

    <DataTable
      v-if="form.post_id !== null"
      ref="table"
      url="/api/admin/cms-post-relations"
      :extra-params="{ post_id: form.post_id }"
    >
      <template #related_post_title="{ row }">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
            <img
              v-if="(row as any).related_post_main_image_url"
              :src="(row as any).related_post_main_image_url"
              :alt="(row as any).related_post_title ?? 'Kapcsolt poszt'"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              -
            </div>
          </div>
          <span class="truncate">{{ (row as any).related_post_title }}</span>
        </div>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="startEdit(row as CmsPostRelation)" />
        <DeleteButton @confirm="removeRelation(row as CmsPostRelation)" />
      </template>

      <template #empty>
        Nincs megjelenitheto kapcsolat.
      </template>
    </DataTable>

    <div
      v-else
      class="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground"
    >
      Valassz egy alap posztot a kapcsolatok megjelenitesehez.
    </div>
  </AdminLayout>
</template>
