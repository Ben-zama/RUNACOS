import { useCookie } from '#app'

export const useRunacosApi = () => {
  const config = useRuntimeConfig();

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      const authToken = useCookie('auth_token').value

      if (authToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authToken}`
        }
      }

      if (options.body && !(options.body instanceof FormData)) {
        options.headers = {
          ...options.headers,
          'Content-Type': 'application/json'
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        console.error('Unauthorized! Token might be invalid or expired.')
        // You could trigger a logout or redirect to /auth here
      }

      console.error("Full API Error Response:", response._data);

      const errorMsg = response._data?.detail
        ? JSON.stringify(response._data.detail) // Grabs strict validation errors
        : response._data?.message || "Something went wrong";

      console.error(`Parsed Error: ${errorMsg}`);
    },
  });

  return { apiFetch };
};
