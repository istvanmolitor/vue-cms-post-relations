<script setup lang="ts">
import { AdminLayout, BackButton, FormButtons, InputError, toastService } from '@admin'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import InputField from '@admin/components/ui/InputField.vue'
import TextareaField from '@admin/components/ui/TextareaField.vue'
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { postRelationTypeService, type PostRelationTypeFormData } from '../../services/postRelationTypeService'

const router = useRouter()
const isSaving = ref(false)
const errors = ref<Record<string, string[]>>({})

const form = reactive<PostRelationTypeFormData>({
  name: '',
  slug: '',
  description: '',
})

watch(() => form.name, (value) => {
  if (!form.slug || form.slug === slugify(form.name)) {
    form.slug = slugify(value)
  }
})

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}

    await postRelationTypeService.create(form)
    toastService.success('Kapcsolat típus sikeresen létrehozva!')

    await router.push('/admin/cms-relation-types')
  } catch (error: any) {
    console.error('Hiba a kapcsolat típus létrehozásakor:', error)
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
</script>

<template>
  <AdminLayout page-title="Új kapcsolat típus">
    <div class="mb-4 flex items-center justify-between">
      <BackButton to="/admin/cms-relation-types" />
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Típus adatai</CardTitle>
        <CardDescription>Add meg az új kapcsolat típus adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <InputField id="name" label="Név" v-model="form.name" placeholder="Kapcsolódó cikkek" :errors="errors.name" />
        <InputField id="slug" label="Slug" v-model="form.slug" placeholder="kapcsolodo-cikkek" :errors="errors.slug" />
        <InputError :message="errors.slug" />
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
