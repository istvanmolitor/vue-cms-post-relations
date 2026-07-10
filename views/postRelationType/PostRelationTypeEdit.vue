<script setup lang="ts">
import { AdminLayout, BackButton, FormButtons, LoadingSpinner, toastService } from '@admin'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import InputField from '@admin/components/ui/InputField.vue'
import TextareaField from '@admin/components/ui/TextareaField.vue'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postRelationTypeService, type PostRelationTypeFormData } from '../../services/postRelationTypeService'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const errors = ref<Record<string, string[]>>({})

const form = reactive<PostRelationTypeFormData>({
  name: '',
  slug: '',
  description: '',
})

const fetchType = async () => {
  const id = route.params.id as string

  try {
    isLoading.value = true
    const { data } = await postRelationTypeService.getById(id)

    form.name = data.data.name
    form.slug = data.data.slug
    form.description = data.data.description ?? ''
  } catch (error) {
    console.error('Hiba a kapcsolat típus betöltésekor:', error)
    await router.push('/admin/cms-relation-types')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  const id = route.params.id as string

  try {
    isSaving.value = true
    errors.value = {}
    await postRelationTypeService.update(id, form)
    toastService.success('Kapcsolat típus sikeresen frissítve!')
    await router.push('/admin/cms-relation-types')
  } catch (error: any) {
    console.error('Hiba a kapcsolat típus frissítésekor:', error)
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
      toastService.error('Kérlek javítsd a hibákat.')
    } else {
      toastService.error('Hiba történt a mentés során.')
    }
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchType()
})
</script>

<template>
  <AdminLayout page-title="Kapcsolat típus szerkesztése">
    <div class="mb-4 flex items-center justify-between">
      <BackButton to="/admin/cms-relation-types" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner label="Betöltés..." />
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Típus adatai</CardTitle>
        <CardDescription>Módosítsd a kapcsolat típus adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <InputField id="name" label="Név" v-model="form.name" placeholder="Kapcsolódó cikkek" :errors="errors.name" />
        <InputField id="slug" label="Slug" v-model="form.slug" placeholder="kapcsolodo-cikkek" :errors="errors.slug" />
        <TextareaField id="description" label="Leírás" v-model="form.description" placeholder="Opcionális leírás" :errors="errors.description" />
      </CardContent>
      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          @save="handleSubmit"
          @cancel="router.push('/admin/cms-relation-types')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
