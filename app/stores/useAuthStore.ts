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
// --- CUSTOM LOGIN ACTION ---
  const login = async (credentials: { email: string; password?: string }) => {
    isLoading.value = true
    authError.value = null
    
    try {
      // 1. Fetch the entire list of users from the API
      const users = await apiFetch<any[]>('/user')
      
      // 2. Search the array for a user with a matching email
      const matchedUser = users.find((u) => u.email === credentials.email)
      
      if (matchedUser) {
        // Success! We found the user.
        // Note: Since the API doesn't store passwords, we are bypassing the password check here.
        currentUser.value = matchedUser
        
        // Optional: Save the user's email or ID to a cookie so they stay logged in on refresh
        // const authCookie = useCookie('auth_user')
        // authCookie.value = matchedUser.email
        
        return matchedUser
      } else {
        // If `.find()` returns undefined, the email isn't in the database
        throw new Error('No account found with this email address.')
      }
      
    } catch (error: any) {
      authError.value = error.message || 'Login failed. Please try again.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return { currentUser, isLoading, authError, signup, login }
})