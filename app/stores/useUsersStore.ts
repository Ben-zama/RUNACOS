import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRunacosApi } from '~/composables/useRunacosApi'

export const useUsersStore = defineStore('users', () => {
  const { apiFetch } = useRunacosApi()

  // State
  const users = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all users
  const fetchUsers = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiFetch<any[]>('/user', {
        method: 'GET'
      })
      // The API returns an array of users
      users.value = response
    } catch (err: any) {
      error.value = err.message || 'Failed to load students.'
      console.error('Error fetching users:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Update a user (Requires PATCH /user/{id} on your backend)
  const updateUser = async (id: string, payload: any) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiFetch(`/user/${id}`, {
        method: 'PATCH', // Change to 'PUT' if your backend expects that instead
        body: payload
      })

      // Update the user locally so the UI refreshes instantly without another API call
      const index = users.value.findIndex(u => (u.id === id || u._id === id))
      if (index !== -1) {
        // Merge the existing user data with the updated payload
        users.value[index] = { ...users.value[index], ...payload }
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update student details.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete a user (Requires DELETE /user/{id} on your backend)
  const deleteUser = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await apiFetch(`/user/${id}`, {
        method: 'DELETE'
      })

      // Remove the user from the local array to instantly update the UI
      users.value = users.value.filter(u => u.id !== id && u._id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete student.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    updateUser,
    deleteUser
  }
})