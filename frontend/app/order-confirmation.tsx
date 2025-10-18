import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { theme } from '../constants/theme';

export default function OrderConfirmationScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Order Confirmed', headerShown: false }} />
            
            <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
            
            <Text style={styles.title}>Thank You!</Text>
            <Text style={styles.subtitle}>Your order has been placed successfully.</Text>
            
            <View style={styles.orderInfo}>
                <Text style={styles.infoText}>Order ID:</Text>
                <Text style={styles.orderIdText}>{orderId}</Text>
            </View>

            <Text style={styles.deliveryInfo}>
                You will receive an email confirmation shortly. Estimated delivery is 3-5 business days.
            </Text>

            <View style={styles.buttonContainer}>
                <CustomButton title="Continue Shopping" onPress={() => router.replace('/(tabs)')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        padding: theme.spacing.l,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: theme.spacing.l,
    },
    subtitle: {
        fontSize: 18,
        color: theme.colors.muted,
        textAlign: 'center',
        marginTop: theme.spacing.s,
    },
    orderInfo: {
        marginTop: theme.spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
    },
    infoText: {
        fontSize: 16,
        color: theme.colors.text,
    },
    orderIdText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: theme.spacing.s,
        color: theme.colors.primary,
    },
    deliveryInfo: {
        fontSize: 14,
        color: theme.colors.muted,
        textAlign: 'center',
        marginVertical: theme.spacing.xl,
        lineHeight: 20,
    },
    buttonContainer: {
        width: '100%',
    }
});
