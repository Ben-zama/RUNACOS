import { defineStore } from 'pinia'

// Types based on the OpenAPI schema [cite: 1200]
export interface RunacosEvent {
  title: string
  type: string
  studentId: string
  status: string
  response: string
  eventTime: string
  description: string
}

export const useEventsStore = defineStore('events', () => {
  const { apiFetch } = useRunacosApi()
  
  const events = ref<RunacosEvent[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all events via the GET /events/ endpoint [cite: 687, 688]
  const fetchEvents = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiFetch<RunacosEvent[]>('/events/')
      events.value = response
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // Create a new event via the POST /events endpoint [cite: 585, 599]
  const createEvent = async (eventData: RunacosEvent) => {
    try {
      const response = await apiFetch<RunacosEvent[]>('/events', {
        method: 'POST',
        body: eventData
      })
      // Optionally re-fetch or append the new data
      await fetchEvents()
      return response
    } catch (err: any) {
      console.error("Failed to create event:", err)
      throw err
    }
  }

  return { events, isLoading, error, fetchEvents, createEvent }
})