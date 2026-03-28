export const useRunacosApi = () => {
  const config = useRuntimeConfig()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      // You can add Authorization headers here later if the API requires tokens
    },
onResponseError({ response }) {
      // LOG THE FULL DATA SO WE CAN SEE THE EXACT FASTAPI ERROR
      console.error('Full API Error Response:', response._data)
      
      const errorMsg = response._data?.detail 
        ? JSON.stringify(response._data.detail) // Grabs strict validation errors
        : response._data?.message || 'Something went wrong'
        
      console.error(`Parsed Error: ${errorMsg}`)
    }
  })

  return { apiFetch }
}