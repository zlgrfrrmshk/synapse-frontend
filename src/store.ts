import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  avatar: string;
  googleemail: string;
  created_at: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  logout: async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    set({ user: null });
  },

  checkAuth: async () => {
    try {
      const res = await axios.get('/api/auth/me');
      set({ user: res.data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));