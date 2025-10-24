import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    LinearGradient,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../constants/config';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { theme } from '../../constants/theme';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();
    const { login, loading } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
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
        <ExpoLinearGradient
            colors={['#6F4E37', '#FADADD']} // coffee to pink gradient
            style={styles.background}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to your account</Text>

                        <CustomInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            style={styles.input}
                            placeholderTextColor="#C49A6C"
                        />

                        <CustomInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                            placeholderTextColor="#C49A6C"
                        />

                        <CustomButton
                            title={loading ? 'Logging in...' : 'Login'}
                            onPress={handleLogin}
                            disabled={loading}
                            style={styles.button}
                            textStyle={styles.buttonText}
                        />

                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ExpoLinearGradient>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: theme.spacing.l,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFD1DC', // soft pink
        textAlign: 'center',
        marginBottom: theme.spacing.m,
    },
    subtitle: {
        fontSize: 16,
        color: '#F5CBA7', // warm beige
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    input: {
        backgroundColor: 'rgba(255, 228, 225, 0.8)', // light pink
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#C49A6C',
        color: '#4E342E',
        marginBottom: theme.spacing.m,
        padding: 12,
    },
    button: {
        backgroundColor: '#6F4E37', // coffee brown
        borderRadius: 10,
        paddingVertical: 14,
        marginTop: 10,
    },
    buttonText: {
        color: '#FFD1DC', // pink text
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    linkText: {
        color: '#FADADD',
        textAlign: 'center',
        marginTop: theme.spacing.l,
        textDecorationLine: 'underline',
    },
});
