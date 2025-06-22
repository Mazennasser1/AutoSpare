import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    
    register: async (firstname,lastname,email,password) => {
        console.log('🛠️ Auth store initialized');
        set({ isLoading: true });
        try {
            const response = await fetch("https://mean-rings-grab.loca.lt/api/auth/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstname, lastname, email, password }),
            });
            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);
            console.log('📡 Response headers:', response.headers);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);

            set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
            return { success: true, message: 'Registration successful' };
        } catch (error) {
            console.error("Registration failed:", error);
            set({ isLoading: false });
            return{success: false, message: error.message};
        }
    },
    }));