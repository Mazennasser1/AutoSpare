import {create} from 'zustand';


export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,

    register: async (firstname,lastname,email,password) => {
        set({ isLoading: true });
        try {
            const resposnse = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstname, lastname, email, password }),
            });
            if (!resposnse.ok) {
                throw new Error('Registration failed');
            }
            const data = await resposnse.json();
            // set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
        } catch (error) {
 
        }
    },
    
    login: async (userData) => {
        set({ loading: true });
        try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        set({ user: userData, isAuthenticated: true, loading: false });
        } catch (error) {
        console.error("Login failed:", error);
        set({ loading: false });
        }
    },
    
    logout: () => {
        set({ user: null, isAuthenticated: false });
    },
    }));