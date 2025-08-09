import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    fontSize: number
    fontFamily: string
    autoSave: boolean
    spellCheck: boolean
    wordWrap: boolean
    showLineNumbers: boolean
    showPageBreaks: boolean
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: User) => void
  logout: () => void
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void
  initializeUser: () => void
}

const defaultPreferences: User['preferences'] = {
  theme: 'light',
  fontSize: 12,
  fontFamily: 'Courier New',
  autoSave: true,
  spellCheck: true,
  wordWrap: true,
  showLineNumbers: false,
  showPageBreaks: true
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false
        })
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
      },

      updateUserPreferences: (preferences: Partial<User['preferences']>) => {
        const { user } = get()
        if (!user) return

        const updatedUser = {
          ...user,
          preferences: {
            ...user.preferences,
            ...preferences
          }
        }

        set({ user: updatedUser })
      },

      initializeUser: () => {
        // Initialize with default user for demo purposes
        const { user } = get()
        if (!user) {
          const defaultUser: User = {
            id: 'demo-user',
            name: 'Professional Writer',
            email: 'writer@hemantdoc.com',
            preferences: defaultPreferences
          }
          
          set({
            user: defaultUser,
            isAuthenticated: true,
            isLoading: false
          })
        }
      }
    }),
    {
      name: 'hemantdoc-scriptwriter-auth',
      version: 1,
    }
  )
)