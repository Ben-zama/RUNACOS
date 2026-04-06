import { ref, watch, onMounted } from 'vue'

const isDark = ref()
let isInitialized = false

export function useTheme() {
  // Apply and persist theme
  function applyTheme(dark: boolean) {
    const theme = dark ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore */
    }
  }

  onMounted(() => {
    // 2. Guard to ensure we only read storage and set up watchers once
    if (isInitialized) return
    
    // Try to read saved theme
    let saved: string | null = null
    try {
      saved = localStorage.getItem('theme')
    } catch {
      /* ignore */
    }

    // If found, use saved theme
    if (saved === 'dark' || saved === 'light') {
      isDark.value = saved === 'dark'
    }
    // Else, use system preference
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDark.value = true
    }

    // Apply chosen theme
    applyTheme(isDark.value)

    // Watch for user toggles (set up only once)
    watch(isDark, (val) => applyTheme(val))

    isInitialized = true
  })

  return {
    isDark,
    toggleTheme: () => (isDark.value = !isDark.value),
  }
}