import { Stack, useSegments, useRouter, useRootNavigationState, Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator,Image } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const rootState = useRootNavigationState();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const { user, token, checkAuth } = useAuthStore();

  // Check authentication status when the component mounts
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    initializeAuth();
  }, []);

  // Handle navigation only when the navigation is ready
  useEffect(() => {
    if (!rootState?.key || isCheckingAuth) return;
    
    // Mark navigation as ready
    setIsNavigationReady(true);
    
    const isAuthRoute = segments[0] === "(auth)";
    const isTabsRoute = user && token;
    
    if (!isAuthRoute && !isTabsRoute) {
      console.log("Redirecting to auth route");
      router.replace("/(auth)/login");
    }
    
    if (isAuthRoute && isTabsRoute) {
      console.log("Redirecting to tabs route");
      router.replace("/(tabs)");
    }
  }, [segments, user, token, isNavigationReady, rootState?.key, isCheckingAuth]);

  // Show splash screen while loading
  if (!isNavigationReady || isCheckingAuth) {
    return (
      <SafeAreaProvider>
        <SafeScreen>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
            <Image 
              source={require('../assets/images/Car-accesories.gif')} 
              style={{ width: 200, height: 200, marginBottom: 20 }}
            />
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={{ marginTop: 20, color: '#333' }}>Loading...</Text>
          </View>
        </SafeScreen>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </SafeAreaProvider>
  );
}