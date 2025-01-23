import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserInfo } from '../types/models/user'

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  
  setUser: (userData: UserInfo, token: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,

      setUser: (userData, token) => set({ 
        user: userData,
        isAuthenticated: true,
        accessToken: token
      }),

      setAccessToken: (token) => set({
        accessToken: token
      }),

      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        accessToken: null,
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
)