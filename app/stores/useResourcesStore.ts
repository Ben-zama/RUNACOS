import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRunacosApi } from '~/composables/useRunacosApi'

export interface ResourcePayload {
  id?: string
  _id?: string
  courseCode: string       // e.g., "CSC 301 PQ"
  type: string       // e.g., "Past Question"
  date?: string
  fileUrl?: string   // The returned URL from the backend
}

export const useResourcesStore = defineStore('resources', () => {
  const { apiFetch } = useRunacosApi()
  
  const resources = ref<ResourcePayload[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchResources = async () => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<ResourcePayload[]>('/resources')
      resources.value = res
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch resources'
    } finally {
      isLoading.value = false
    }
  }

  // Accepts FormData to handle file uploads natively
  const createResource = async (formData: FormData) => {
    isLoading.value = true
    error.value = null
    try {
      // Remember our raw native fetch bypass if the composable acts up again! 
      // For now, let's assume the composable is fixed.
      const res = await apiFetch('/resources', {
        method: 'POST',
        body: formData 
      })
      await fetchResources() 
      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to upload resource'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateResource = async (idToUpdate: string, formData: FormData) => {
    try {
      const res = await apiFetch(`/resources/${idToUpdate}`, {
        method: 'PATCH',
        body: formData
      })
      await fetchResources()
      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to update resource'
      throw err
    }
  }

  const deleteResource = async (idToDelete: string) => {
    try {
      await apiFetch(`/resources/${idToDelete}`, {
        method: 'DELETE'
      })
      resources.value = resources.value.filter(r => r.id !== idToDelete && r._id !== idToDelete)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete resource'
      throw err
    }
  }

  return { resources, isLoading, error, fetchResources, createResource, updateResource, deleteResource }
})