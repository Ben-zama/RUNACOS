import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRunacosApi } from '~/composables/useRunacosApi'

export interface PostPayload {
  id?: string
  _id?: string
  title: string
  category: string
  status: string
  content: string // The main body of the blog post
  date?: string
}

export const usePostsStore = defineStore('posts', () => {
  const { apiFetch } = useRunacosApi()
  
  const posts = ref<PostPayload[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchPosts = async () => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<PostPayload[]>('/posts')
      posts.value = res
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch posts'
    } finally {
      isLoading.value = false
    }
  }

  const createPost = async (postData: PostPayload) => {
    isLoading.value = true
    error.value = null
    try {
      const { id, _id, ...cleanPayload } = postData

      const res = await apiFetch('/posts', {
        method: 'POST',
        body: cleanPayload
      })
      await fetchPosts() 
      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to create post'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updatePost = async (idToUpdate: string, updates: Partial<PostPayload>) => {
    try {
      const { id, _id, ...cleanUpdates } = updates

      const res = await apiFetch(`/posts/${idToUpdate}`, {
        method: 'PATCH',
        body: cleanUpdates
      })
      
      const index = posts.value.findIndex(p => p.id === idToUpdate || p._id === idToUpdate)
      if (index !== -1) {
        posts.value[index] = { ...posts.value[index], ...updates }
      }
      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to update post'
      throw err
    }
  }

  const deletePost = async (idToDelete: string) => {
    try {
      await apiFetch(`/posts/${idToDelete}`, {
        method: 'DELETE'
      })
      posts.value = posts.value.filter(p => p.id !== idToDelete && p._id !== idToDelete)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete post'
      throw err
    }
  }

  return { posts, isLoading, error, fetchPosts, createPost, updatePost, deletePost }
})