import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRunacosApi } from '~/composables/useRunacosApi'

export interface FaultPayload {
  id: string
  title: string
  studentId: string
  description: string
  status: string
  response: string
}

export const useFaultsStore = defineStore('faults', () => {
  const { apiFetch } = useRunacosApi()
  
  const faults = ref<FaultPayload[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all faults for the admin dashboard
  const fetchFaults = async () => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<FaultPayload[]>('/faults')
      faults.value = res
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch faults'
    } finally {
      isLoading.value = false
    }
  }

  // Submit a new fault (from the contact page)
  const submitFault = async (faultData: FaultPayload) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch('/faults', {
        method: 'POST',
        body: faultData
      })
      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to submit fault'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteFault = async (id: string) => {
    try {
      await apiFetch(`/faults/${id}`, {
        method: 'DELETE'
      })
      // Instantly remove it from the UI without reloading the page
      faults.value = faults.value.filter(fault => fault.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete fault'
      throw err
    }
  }

  const updateFault = async (id: string, updates: Partial<FaultPayload>) => {
    try {
      const res = await apiFetch(`/faults/${id}`, {
        method: 'PATCH',
        body: updates
      })
      
      // Find the fault in our local array and update it instantly
      const index = faults.value.findIndex(f => f.id === id)
      if (index !== -1) {
        faults.value[index] = { ...faults.value[index], ...updates }
      }
      
      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to update fault'
      throw err
    }
  }

  return { faults, isLoading, error, fetchFaults, submitFault, deleteFault, updateFault }
})