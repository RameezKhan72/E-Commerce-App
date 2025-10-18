import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground, TouchableOpacity } from 'react-native';
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
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert('Error', 'Please fill in all fields.');
        }
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/users/login`, { email, password });
            await login(response.data.token);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'An error occurred during login.';
            Alert.alert('Login Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.overlay}>
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
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        // Reduced the overlay's opacity to make the background more vibrant
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        padding: theme.spacing.l,
        paddingTop: 50,
        paddingBottom: 50,
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

