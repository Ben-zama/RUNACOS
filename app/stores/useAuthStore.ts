import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRunacosApi } from '~/composables/useRunacosApi'
import { useCookie } from '#app'

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

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
    maxAge: 3600
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
// Inside useAuthStore.ts
  const login = async (credentials: { email: string; password?: string }) => {
    isLoading.value = true
    authError.value = null
    
    try {
      const response = await apiFetch<any>('/login', {
        method: 'POST',
        body: credentials
      })
      
      currentUser.value = response
      
      // 1. Save the idToken (NOT the localId) as your VIP pass
      const authToken = useCookie('auth_token', { maxAge: 3600 })
      authToken.value = response.idToken 
      
      // 2. Crack open the token to find the role!
      const decodedToken = parseJwt(response.idToken)
      
      // 3. Save the hidden role to your cookie (fallback to 'student' if missing)
      const userRole = useCookie('user_role', { maxAge: 3600 })
      userRole.value = decodedToken?.role || 'student'
      
      // We must return the decoded role so your UI knows where to navigate
      return { ...response, role: userRole.value }
      
    } catch (error: any) {
      authError.value = error.message || 'Login failed.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  console.log(currentUser.value)

const logout = () => {
    // 1. Clear the local Pinia state
    currentUser.value = null
    
    // 2. Grab the cookies we created during login
    const authToken = useCookie('auth_token')
    const userRole = useCookie('user_role')
    
    // 3. Destroy the cookies by setting them to null
    authToken.value = null
    userRole.value = null
    
    // 4. Redirect the user back to the authentication page
    navigateTo('/')
}

  return { currentUser, isLoading, authError, signup, login, logout }
})