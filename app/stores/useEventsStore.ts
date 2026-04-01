import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRunacosApi } from '~/composables/useRunacosApi'

export interface EventPayload {
  id?: string
  _id?: string
  title: string
  eventType: string
  studentId: string
  status: string
  response: string
  eventTime: string 
  description: string
  fileUrl: string // The image URL returned by the backend
}

export const useEventsStore = defineStore('events', () => {
  const { apiFetch } = useRunacosApi()
  
  const events = ref<EventPayload[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchEvents = async () => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<EventPayload[]>('/events')
      events.value = res
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch events'
    } finally {
      isLoading.value = false
    }
  }

  // UPDATED: Now accepts FormData
  const createEvent = async (formData: FormData) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch('/events', {
        method: 'POST',
        body: formData // $fetch handles the multipart headers automatically
      })
      await fetchEvents() 
      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to create event'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // UPDATED: Now accepts FormData for updating the image as well
const updateEvent = async (idToUpdate: string, formData: FormData) => {
  isLoading.value = true   // missing
  error.value = null       // missing
  try {
    const res = await apiFetch(`/events/${idToUpdate}`, { method: 'PATCH', body: formData })
    await fetchEvents()
    return res
  } catch (err: any) {
    error.value = err.message || 'Failed to update event'
    throw err
  } finally {
    isLoading.value = false  // missing
  }
}

const deleteEvent = async (idToDelete: string) => {
  isLoading.value = true   // missing
  error.value = null       // missing
  try {
    await apiFetch(`/events/${idToDelete}`, { method: 'DELETE' })
    events.value = events.value.filter(e => e.id !== idToDelete && e._id !== idToDelete)
  } catch (err: any) {
    error.value = err.message || 'Failed to delete event'
    throw err
  } finally {
    isLoading.value = false  // missing
  }
}

  return { events, isLoading, error, fetchEvents, createEvent, updateEvent, deleteEvent }
})