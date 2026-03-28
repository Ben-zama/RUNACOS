import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRunacosApi } from '~/composables/useRunacosApi'

export interface EventPayload {
  id?: string
  _id?: string
  title: string
  type: string
  studentId: string
  status: string
  response: string
  eventTime: string // ISO 8601 date-time string
  description: string
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

  const createEvent = async (eventData: EventPayload) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch('/events', {
        method: 'POST',
        body: eventData
      })
      await fetchEvents() // Refresh the list after creating
      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to create event'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateEvent = async (id: string, updates: Partial<EventPayload>) => {
    try {
      const res = await apiFetch(`/events/${id}`, {
        method: 'PATCH',
        body: updates
      })
      // Instantly update the UI
      const index = events.value.findIndex(e => e.id === id || e._id === id)
      if (index !== -1) {
        events.value[index] = { ...events.value[index], ...updates }
      }
      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to update event'
      throw err
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      await apiFetch(`/events/${id}`, {
        method: 'DELETE'
      })
      events.value = events.value.filter(e => e.id !== id && e._id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete event'
      throw err
    }
  }

  return { events, isLoading, error, fetchEvents, createEvent, updateEvent, deleteEvent }
})