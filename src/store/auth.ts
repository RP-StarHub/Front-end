import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserInfo } from '../types/api/user'

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  setUser: (userData: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (userData) => set({ 
        user: userData,
        isAuthenticated: true 
      }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
)