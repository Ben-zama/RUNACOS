import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRunacosApi } from '~/composables/useRunacosApi'
import { useCookie } from '#app'

// TypeScript interfaces matching the OpenAPI schema
export interface StudentInfo {
  department: string
  matricNumber: string
}

export interface AlumniInfo {
  currentCompany?: string
  graduationYear?: string
  isStar?: boolean
  jobTitle?: string
}

export interface UserSignupPayload {
  username: string
  email: string
  password: string
  role?: string // Defaults to 'student'
  studentInfo?: StudentInfo
  alumniInfo?: AlumniInfo | null
}

export const useAuthStore = defineStore('auth', () => {
  const { apiFetch } = useRunacosApi()
  
  const currentUser = ref<any>(null)
  const isLoading = ref(false)
  const authError = ref<string | null>(null)

  const authToken = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 5  //keeps the user logged in for 7 days
  })

  // Registration Action
  const signup = async (userData: UserSignupPayload) => {
    isLoading.value = true
    authError.value = null
    
    try {
      // Updated to use the new /signup route per the OpenAPI spec
      const response = await apiFetch('/signup', {
        method: 'POST',
        body: userData
      })
      
      currentUser.value = response
      return response
    } catch (error: any) {
      authError.value = error.message || 'Failed to create account.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Proper Login Action
  const login = async (credentials: { email: string; password?: string }) => {
    isLoading.value = true
    authError.value = null
    
    try {
      // Updated to use the dedicated /login route
      const response = await apiFetch('/login', {
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password
        }
      })
      
      // Success! Assuming the API returns the user object or a token
      currentUser.value = response

      authToken.value = response.id
      
      return response
    } catch (error: any) {
      authError.value = error.message || 'Login failed. Please check your credentials.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    authToken.value = null
    currentUser.value = null
    // navigateTo('/auth') // Redirect to login page
  }

  return { currentUser, isLoading, authError, signup, login }
})