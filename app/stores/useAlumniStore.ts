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
      const response = await apiFetch<any[]>('/user', { method: 'GET' })
      alumni.value = response.filter(user => user.role === 'alumni')
    } catch (err: any) {
      error.value = err.message || 'Failed to load alumni records.'
      console.error('Error fetching alumni:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addAlumni = async (payload: any) => {
    isLoading.value = true
    error.value = null
    try {
      // Force the role to 'alumni' before sending
      const data = { ...payload, role: 'alumni' }
      await apiFetch('/user', {
        method: 'POST',
        body: data
      })
      await fetchAlumni()
    } catch (err: any) {
      error.value = err.message || 'Failed to add alumni.'
      console.error('Error adding alumni:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateAlumni = async (id: string, payload: any) => {
    isLoading.value = true
    error.value = null
    try {
      await apiFetch(`/user/${id}`, {
        method: 'PATCH',
        body: payload
      })
      await fetchAlumni()
    } catch (err: any) {
      error.value = err.message || 'Failed to update alumni.'
      console.error('Error updating alumni:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteAlumni = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await apiFetch(`/user/${id}`, { method: 'DELETE' })
      alumni.value = alumni.value.filter(a => a.id !== id && a._id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete alumni.'
      console.error('Failed to delete alumni:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    alumni,
    isLoading,
    error,
    fetchAlumni,
    addAlumni,
    updateAlumni,
    deleteAlumni
  }
})