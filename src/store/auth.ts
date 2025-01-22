import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserInfo } from '../types/models/user'
import { LoginUserRequest } from '../types/api/user';

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  pendingCredentials: LoginUserRequest | null;
  
  setUser: (userData: UserInfo, token: string) => void;
  setAccessToken: (token: string) => void;
  setPendingCredentials: (credentials: LoginUserRequest) => void;
  clearPendingCredentials: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      pendingCredentials: null,

      setUser: (userData, token) => set({ 
        user: userData,
        isAuthenticated: true,
        accessToken: token
      }),

      setAccessToken: (token) => set({
        accessToken: token
      }),

      setPendingCredentials: (credentials) => set({
        pendingCredentials: credentials
      }),

      clearPendingCredentials: () => set({
        pendingCredentials: null
      }),

      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        accessToken: null,
        pendingCredentials: null
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
)