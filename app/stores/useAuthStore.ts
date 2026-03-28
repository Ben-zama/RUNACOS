import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRunacosApi } from '~/composables/useRunacosApi'

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
  role?: string // Defaults to 'student'
  studentInfo?: StudentInfo
  alumniInfo?: AlumniInfo | null
}

export const useAuthStore = defineStore('auth', () => {
  const { apiFetch } = useRunacosApi()
  
  const currentUser = ref<any>(null)
  const isLoading = ref(false)
  const authError = ref<string | null>(null)

  // Registration Action
  const signup = async (userData: UserSignupPayload) => {
    isLoading.value = true
    authError.value = null
    
    try {
      const response = await apiFetch('/user', {
        method: 'POST',
        body: userData
      })
      
      // The API returns an array of the created user schema on 201 Created
      currentUser.value = response
      return response
    } catch (error: any) {
      authError.value = error.message || 'Failed to create account.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Placeholder for Login
  const login = async (credentials: any) => {
    console.warn('Login endpoint not yet defined in API spec')
  }

  return { currentUser, isLoading, authError, signup, login }
})