import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../constants/config';
import { useAuth } from '../../contexts/AuthContext';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { theme } from '../../constants/theme';
import { backgroundImage } from '../../constants/images';

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { login, loading } = useAuth();

    const handleSignup = async () => {
        if (!name || !email || !password) {
            return Alert.alert('Error', 'Please fill in all fields.');
        }
        try {
            const response = await axios.post(`${API_URL}/users/register`, { name, email, password });
            await login(response.data.token);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'An error occurred during sign-up.';
            Alert.alert('Sign-up Failed', errorMessage);
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
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Get started with your new account</Text>
                        <CustomInput
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                        />
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
                        <CustomButton title={loading ? 'Creating Account...' : 'Sign Up'} onPress={handleSignup} disabled={loading} />

                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text style={styles.linkText}>Already have an account? Log In</Text>
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
        ...StyleSheet.absoluteFillObject,
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

