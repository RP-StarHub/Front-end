import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserInfo } from '../types/models/user'

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  
  setUser: (userData: UserInfo, tokens: { accessToken: string; refreshToken: string }) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,

      setUser: (userData, tokens) => set({ 
        user: userData,
        isAuthenticated: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }),

      setTokens: (tokens) => set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }),

      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
)