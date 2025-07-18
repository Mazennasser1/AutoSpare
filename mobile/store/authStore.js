import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    
    login: async (email, password) => {
        console.log('🛠️ Auth store initialized');
        set({ isLoading: true });
        try {
            const response = await fetch("http://192.168.1.7:3000/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            console.log('📡 Request sent to login endpoint');
            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);
            console.log('📡 Response headers:', response.headers);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);

            set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
            return { success: true, message: 'Login successful' };
        } catch (error) {
            console.error("Login failed:", error);
            set({ isLoading: false });
            return { success: false, message: error.message };  
        }
    },
    register: async (firstname,lastname,email,password) => {
        console.log('🛠️ Auth store initialized');
        set({ isLoading: true });
        try {
            const response = await fetch("http://192.168.1.7:3000/api/auth/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstname, lastname, email, password }),
            });
            console.log('📡 Request sent to registration endpoint');
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
    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const user = await AsyncStorage.getItem('user');
            const token = await AsyncStorage.getItem('token');

            set({user, token});
            if (user && token) {
                set({ user: JSON.parse(user), token, isAuthenticated: true, isLoading: false });
            } else {
                set({ isAuthenticated: false, isLoading: false });
            }
        } catch (error) {
            console.error("Error checking authentication:", error);
            set({ isAuthenticated: false, isLoading: false });
        }
    },
    logout: async () => {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        } catch (error) {
            console.error("Error during logout:", error);
        }
    },
    }));