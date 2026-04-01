import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRunacosApi } from '~/composables/useRunacosApi'

export const useAlumniStore = defineStore('alumni', () => {
  const { apiFetch } = useRunacosApi()

  const alumni = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchAlumni = async () => {
    isLoading.value = true
    error.value = null
    try {
      // Fetch all users from the backend
      const response = await apiFetch<any[]>('/user', {
        method: 'GET'
      })
      
      // Filter the array to only store alumni
      alumni.value = response.filter(user => user.role === 'alumni')
    } catch (err: any) {
      error.value = err.message || 'Failed to load alumni records.'
      console.error('Error fetching alumni:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Optional: Add a delete function if you need the trash can to work
  const deleteAlumni = async (id: string) => {
    try {
      await apiFetch(`/user/${id}`, { method: 'DELETE' })
      alumni.value = alumni.value.filter(a => a.id !== id && a._id !== id)
    } catch (err: any) {
      console.error('Failed to delete alumni:', err)
      throw err
    }
  }

  return {
    alumni,
    isLoading,
    error,
    fetchAlumni,
    deleteAlumni
  }
})