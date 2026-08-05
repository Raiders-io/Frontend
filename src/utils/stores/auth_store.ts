import { create } from 'zustand'
import type { User } from '@/utils/types/auth'

interface AuthState {
	user: User | null
	token: string | null
	setAuth: (user: User, token: string) => void
	logout: () => void
}

function stateBuilder(set: (state: Partial<AuthState>) => void): AuthState {
    const state: AuthState = {
        user: null,
        token: localStorage.getItem('token'),

        setAuth: function(user: User | null, token: string | '') {
            localStorage.setItem('token', token);
            set({ user: user, token: token });
        },

        logout: function() {
            localStorage.removeItem('token');
            set({ user: null, token: null });
        }
    };
    return state;
}

export const useAuthStore = create<AuthState>(stateBuilder);