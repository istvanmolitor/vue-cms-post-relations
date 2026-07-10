<script setup lang="ts">
import { AdminLayout, toastService } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { postRelationTypeService, type PostRelationType } from '../../services/postRelationTypeService'

const router = useRouter()
const table = ref()

const deleteType = async (id: number) => {
  try {
    await postRelationTypeService.delete(id)
    toastService.success('A kapcsolat típus sikeresen törölve!')
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba a kapcsolat típus törlésekor:', error)
    toastService.error('Hiba történt a törlés során.')
  }
}

const editType = (id: number) => {
  router.push(`/admin/cms-relation-types/${id}/edit`)
}
</script>

<template>
  <AdminLayout page-title="Kapcsolat típusok">
    <DataTable
      ref="table"
      url="/api/admin/post-relation-types"
    >
      <template #actions>
        <CreateButton to="/admin/cms-relation-types/create">Új típus</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editType((row as PostRelationType).id)" />
        <DeleteButton @confirm="deleteType((row as PostRelationType).id)" />
      </template>

      <template #empty>
        Nincs megjeleníthető kapcsolat típus.
      </template>
    </DataTable>
  </AdminLayout>
</template>
