export const useRunacosApi = () => {
  const config = useRuntimeConfig()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      // You can add Authorization headers here later if the API requires tokens
    },
    onResponseError({ response }) {
      // The API returns a specific Error schema with code, status, and message [cite: 977, 980, 984, 988]
      console.error(`API Error: ${response._data?.message || 'Something went wrong'}`)
    }
  })

  return { apiFetch }
}