import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRunacosApi } from '~/composables/useRunacosApi'

export interface PostPayload {
  id?: string
  _id?: string
  title: string
  content: string 
  authorName: string
  authorId: string
  createdAt?: string
  fileUrl?: string // URL returned by the backend after upload
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
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  // Create uses FormData (Multipart) to handle the file upload
  const createPost = async (formData: FormData) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch('/posts', {
        method: 'POST',
        body: formData
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

  // Update uses standard JSON (Record<string, any>) for text updates
  const updatePost = async (idToUpdate: string, updates: Record<string, any>) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch(`/posts/${idToUpdate}`, {
        method: 'PATCH',
        body: updates
      })
      await fetchPosts()
      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to update post'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deletePost = async (idToDelete: string) => {
    isLoading.value = true
    error.value = null
    try {
      await apiFetch(`/posts/${idToDelete}`, {
        method: 'DELETE'
      })
      posts.value = posts.value.filter(p => p.id !== idToDelete && p._id !== idToDelete)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete post'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return { posts, isLoading, error, fetchPosts, createPost, updatePost, deletePost }
})