// middleware/admin.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Read the cookies
  const authToken = useCookie('auth_token')
  const userRole = useCookie('user_role')

  // Condition 1: If they aren't logged in at all, send to auth page
  if (!authToken.value) {
    return navigateTo('/authentication') 
  }

  // Condition 2: If they are logged in, but NOT an admin, kick them out
  if (userRole.value !== 'admin') {
    // You can redirect them to a student dashboard, home page, or show an error
    console.warn('Unauthorized access attempt: User is not an admin.')
    return navigateTo('/') // Redirect to the home page or a "Not Authorized" page
  }
})