import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import axios from 'axios';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { theme } from '../constants/theme';
import { ActivityIndicator, View } from 'react-native';

const InitialLayout = () => {
    const { user, loading, logout } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const responseInterceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [logout]);

    useEffect(() => {
        if (loading) return;
        const inAuthGroup = segments[0] === '(auth)';
        if (user && inAuthGroup) {
            router.replace('/(tabs)');
        } else if (!user && !inAuthGroup) {
            router.replace('/(auth)/login');
        }
    }, [user, loading, segments, router]);

    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
    }

    return (
        <Stack screenOptions={{ contentStyle: { backgroundColor: theme.colors.background } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="checkout" options={{ presentation: 'modal', title: 'Checkout' }} />
            <Stack.Screen name="order-confirmation" options={{ headerShown: false }} />
            <Stack.Screen name="my-orders" options={{ headerShown: false }} />
        </Stack>
    );
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
        <AuthProvider>
          <CartProvider>
            <InitialLayout />
          </CartProvider>
        </AuthProvider>
    </SafeAreaProvider>
  );
}

