import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types/models/user'
import { UserInfo } from '../types/api/user'

interface AuthState {
  user: User | null;
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
        user: {
          ...userData,
          userId: Number(userData.loginId)
        },
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