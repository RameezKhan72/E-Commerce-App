import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../constants/config';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { theme } from '../../constants/theme';
import { backgroundImage } from '../../constants/images';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { login, loading } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert('Error', 'Please fill in all fields.');
        }
        try {
            const response = await axios.post(`${API_URL}/users/login`, { email, password });
            await login(response.data.token);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'An error occurred during login.';
            Alert.alert('Login Failed', errorMessage);
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.overlay} />
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to your account</Text>
                        <CustomInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                        <CustomInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <CustomButton title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />

                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // This makes the overlay cover the entire background
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: theme.spacing.l,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: theme.spacing.m,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    linkText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: theme.spacing.l,
        textDecorationLine: 'underline',
    },
});

